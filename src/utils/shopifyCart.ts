// ─── Shopify Storefront Cart Utility ────────────────────────────────────────
// Uses the Shopify Storefront API (client-side safe – Storefront tokens are public)

const CART_ID_KEY = "cg_cart_id";

function getConfig(): { domain: string; token: string } {
  const cfg = (window as any).__SHOPIFY_CONFIG__;
  if (!cfg) throw new Error("Shopify config not found on window.__SHOPIFY_CONFIG__");
  return cfg;
}

async function shopifyFetch(query: string, variables: Record<string, unknown> = {}) {
  const { domain, token } = getConfig();
  const res = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  return res.json();
}

// ─── Fragments ───────────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  id
  checkoutUrl
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            quantityAvailable
            product {
              title
              handle
              images(first: 1) { edges { node { url altText } } }
              kilates: metafield(namespace: "custom", key: "quilates") {
                value
              }
            }
          }
        }
      }
    }
  }
  cost {
    totalAmount { amount currencyCode }
  }
`;

// ─── Cart operations ──────────────────────────────────────────────────────────

export async function createCart(variantId: string, quantity = 1) {
  const { data } = await shopifyFetch(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }`,
    { input: { lines: [{ merchandiseId: variantId, quantity }] } }
  );
  const cart = data?.cartCreate?.cart;
  if (cart) localStorage.setItem(CART_ID_KEY, cart.id);
  return cart;
}

export async function getCart() {
  const cartId = localStorage.getItem(CART_ID_KEY);
  if (!cartId) return null;
  const { data } = await shopifyFetch(
    `query getCart($id: ID!) {
      cart(id: $id) { ${CART_FRAGMENT} }
    }`,
    { id: cartId }
  );
  return data?.cart ?? null;
}

export async function addToCart(variantId: string, quantity = 1) {
  let cartId = localStorage.getItem(CART_ID_KEY);

  // No cart yet → create one
  if (!cartId) return createCart(variantId, quantity);

  const { data } = await shopifyFetch(
    `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  const cart = data?.cartLinesAdd?.cart;
  if (!cart) {
    // Cart expired → create fresh
    localStorage.removeItem(CART_ID_KEY);
    return createCart(variantId, quantity);
  }
  return cart;
}

export async function updateCartLine(lineId: string, quantity: number) {
  const cartId = localStorage.getItem(CART_ID_KEY);
  if (!cartId) return null;
  const { data } = await shopifyFetch(
    `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return data?.cartLinesUpdate?.cart ?? null;
}

export async function removeCartLine(lineId: string) {
  const cartId = localStorage.getItem(CART_ID_KEY);
  if (!cartId) return null;
  const { data } = await shopifyFetch(
    `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds: [lineId] }
  );
  return data?.cartLinesRemove?.cart ?? null;
}

export async function removeCartLines(lineIds: string[]) {
  const cartId = localStorage.getItem(CART_ID_KEY);
  if (!cartId || lineIds.length === 0) return null;
  const { data } = await shopifyFetch(
    `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FRAGMENT} }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds }
  );
  return data?.cartLinesRemove?.cart ?? null;
}

// ─── Inventory ────────────────────────────────────────────────────────────────

/**
 * Fetches quantityAvailable for a list of variant IDs from Shopify.
 * Returns a map of { variantId: quantityAvailable }.
 * Used to cap the + button on cart items without waiting for every action.
 */
export async function getVariantsInventory(
  variantIds: string[]
): Promise<Record<string, number>> {
  if (!variantIds.length) return {};

  // Build a multi-alias query — one node lookup per variant
  const queries = variantIds
    .map(
      (id, i) =>
        `v${i}: node(id: ${JSON.stringify(id)}) {
          ... on ProductVariant { quantityAvailable }
        }`
    )
    .join("\n");

  try {
    const { data } = await shopifyFetch(`{ ${queries} }`);
    const result: Record<string, number> = {};
    variantIds.forEach((id, i) => {
      const qty = data?.[`v${i}`]?.quantityAvailable;
      if (typeof qty === "number") result[id] = qty;
    });
    return result;
  } catch {
    return {};
  }
}

// ─── Cart count helper ────────────────────────────────────────────────────────

export function countItems(cart: any): number {
  if (!cart) return 0;
  return (cart.lines?.edges ?? []).reduce(
    (acc: number, { node }: any) => acc + node.quantity,
    0
  );
}

// ─── Event helpers ────────────────────────────────────────────────────────────

export function dispatchCartUpdated(count: number) {
  window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count } }));
}

export function dispatchOpenCart() {
  window.dispatchEvent(new CustomEvent("cartOpen"));
}
