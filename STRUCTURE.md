# Site Architecture — goldcoronado.com

## URL Inventory (18 URLs)

| URL | Type | Last Modified |
|-----|------|---------------|
| `https://goldcoronado.com/` | Homepage | 2026-04-17 |
| `https://goldcoronado.com/category/rings/` | Category | 2026-04-17 |
| `https://goldcoronado.com/category/necklaces/` | Category | 2026-04-17 |
| `https://goldcoronado.com/products/brilliant-woven-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/coeur-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/coeur-de-lumiere-ring-sophisticated-version/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/coeur-noire-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/eclat-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/feuille-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/ghost-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/infini-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/intertwined-hearts-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/lumiere-knot-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/ruche-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/products/trefle-de-lumiere-ring/` | Product | 2026-04-17 |
| `https://goldcoronado.com/privacy-policy/` | Legal | 2026-04-16 |
| `https://goldcoronado.com/shipping-policy/` | Legal | 2026-04-16 |
| `https://goldcoronado.com/terms-of-service/` | Legal | 2026-04-16 |

**Total: 18 URLs** (well below 50k limit — single sitemap file is sufficient)

## Sitemap Files

| File | URLs | Purpose |
|------|------|---------|
| `public/sitemap.xml` | 18 | All indexable pages |
| `public/robots.txt` | — | Crawl directives + sitemap reference |

## Excluded from Sitemap

| URL | Reason |
|-----|--------|
| `/category/earrings/` | Returns 404 — not yet implemented |

## Notes for Future Updates

- **When adding new products**: Add a `<url>` block to `sitemap.xml` with the new product URL and today's date as `<lastmod>`
- **When adding earrings category**: Add `/category/earrings/` once the page returns 200
- **Recommended long-term**: Install `@astrojs/sitemap` to auto-generate the sitemap at build time instead of maintaining it manually
  ```bash
  npm install @astrojs/sitemap
  ```
  Then add to `astro.config.mjs`:
  ```js
  import sitemap from '@astrojs/sitemap';
  export default defineConfig({
    site: 'https://goldcoronado.com',
    integrations: [react(), sitemap()],
  });
  ```
  This makes `public/sitemap.xml` redundant — delete it once the integration is active.
