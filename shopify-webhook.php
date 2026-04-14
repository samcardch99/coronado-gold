<?php
/**
 * Shopify Webhook → GitHub Actions Trigger
 *
 * Coloca este archivo en tu Hostinger (ej: /public_html/shopify-webhook.php)
 * Las credenciales van en webhook-config.php (NO se sube a GitHub)
 */

$config_file = __DIR__ . '/webhook-config.php';

if (!file_exists($config_file)) {
    http_response_code(500);
    exit('Error: webhook-config.php no encontrado. Crea el archivo con tus credenciales.');
}

require $config_file;

// ── 1. Solo aceptar POST ────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// ── 2. Leer el cuerpo de la petición ───────────────────────────────────────
$payload = file_get_contents('php://input');

// ── 3. Verificar la firma HMAC de Shopify (seguridad) ──────────────────────
$shopify_hmac = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'] ?? '';
$calculated   = base64_encode(hash_hmac('sha256', $payload, SHOPIFY_SECRET, true));

if (!hash_equals($calculated, $shopify_hmac)) {
    http_response_code(401);
    exit('Unauthorized: invalid HMAC signature');
}

// ── 4. Cooldown: ignorar si ya se disparó un build hace menos de 60 segundos ─
$cooldown_file = sys_get_temp_dir() . '/cg_last_deploy.txt';
$cooldown_secs = 60;

if (file_exists($cooldown_file)) {
    $last = (int) file_get_contents($cooldown_file);
    if ((time() - $last) < $cooldown_secs) {
        http_response_code(200);
        exit('OK: skipped (cooldown activo, deploy reciente en curso)');
    }
}
file_put_contents($cooldown_file, time());

// ── 5. Disparar el workflow en GitHub via API ──────────────────────────────
$url  = sprintf(
    'https://api.github.com/repos/%s/%s/actions/workflows/%s/dispatches',
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_WORKFLOW
);

$body = json_encode(['ref' => GITHUB_BRANCH]);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_HTTPHEADER     => [
        'Accept: application/vnd.github.v3+json',
        'Authorization: Bearer ' . GITHUB_TOKEN,
        'Content-Type: application/json',
        'User-Agent: shopify-webhook-trigger',
    ],
]);

$response  = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// ── 6. Responder a Shopify ─────────────────────────────────────────────────
if ($http_code === 204) {
    http_response_code(200);
    echo 'OK: workflow triggered successfully';
} else {
    http_response_code(500);
    echo 'Error triggering workflow. GitHub response: ' . $http_code;
}
