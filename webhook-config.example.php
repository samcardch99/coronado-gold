<?php
/**
 * PLANTILLA de configuración del webhook.
 *
 * 1. Copia este archivo y renómbralo a: webhook-config.php
 * 2. Rellena los valores reales
 * 3. Sube SOLO webhook-config.php a Hostinger via FTP (NO a GitHub)
 */

define('SHOPIFY_SECRET',  'tu-shopify-secret-aqui');   // El secret que defines en Shopify
define('GITHUB_TOKEN',    'github_pat_XXXXXXXXXXXX');   // Tu Personal Access Token de GitHub
define('GITHUB_OWNER',    'samcardch99');
define('GITHUB_REPO',     'coronado-gold');
define('GITHUB_WORKFLOW', 'deploy.yml');
define('GITHUB_BRANCH',   'main');
