# Full SEO Audit Report — Coronado Gold
**Domain:** https://goldcoronado.com  
**Audit Date:** 2026-04-17  
**Business Type:** E-commerce — Fine Gold Jewelry (Local + Online)  
**Platform:** Astro v6.1.5 + Shopify Storefront API + Hostinger/LiteSpeed  
**Pages Crawled:** 19 (homepage, 2 category, 12 ring products, 4 necklace products) + 2 broken URLs

---

## Overall SEO Health Score: **63 / 100**

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 72/100 | 22% | 15.8 |
| Content Quality | 48/100 | 23% | 11.0 |
| On-Page SEO | 58/100 | 20% | 11.6 |
| Schema / Structured Data | 65/100 | 10% | 6.5 |
| Performance (CWV) | 70/100 | 10% | 7.0 |
| AI Search Readiness | 75/100 | 10% | 7.5 |
| Images | 82/100 | 5% | 4.1 |
| **Total** | | **100%** | **63.5** |

---

## Executive Summary

Coronado Gold has a well-structured Astro site with a solid technical foundation — HTTPS, security headers, canonical tags, lazy loading, and Product schema are all in place. However, the site suffers from **critically thin content** across all product and category pages, several **sitemap gaps**, a **broken OG image**, a **404 earrings category** linked from the nav, and **necklace products with wrong breadcrumb schema**. These issues collectively limit organic visibility for a brand with clear commercial intent in a competitive jewelry niche.

### Top 5 Critical Issues
1. **OG image 404** — `/og-image.jpg` returns 404; all pages share this broken social preview
2. **Earrings nav link → 404** — `/category/earrings` is linked in the nav but returns a 404
3. **4 necklace products missing from sitemap** — Google may not discover them
4. **Necklace products show "Rings" breadcrumb** — wrong category in both display and schema
5. **Homepage meta description 165 chars** — exceeds the ~160 char limit, likely to be truncated

### Top 5 Quick Wins
1. Fix OG image (create and upload `/public/og-image.jpg`)
2. Remove or build the earrings nav link to prevent 404
3. Add necklace product URLs to `sitemap.xml`
4. Fix breadcrumb logic for necklace products
5. Trim homepage meta description to ≤155 chars

---

## 1. Technical SEO

### 1.1 Crawlability & Indexability
| Check | Status | Notes |
|-------|--------|-------|
| robots.txt | ✅ Pass | `Allow: /` for all agents; sitemap URL declared |
| Sitemap declared in robots.txt | ✅ Pass | Points to correct URL |
| Canonical tags | ✅ Pass | All crawled pages have self-referencing canonicals |
| HTTPS | ✅ Pass | HSTS enabled with preload |
| Trailing slash consistency | ⚠️ Inconsistent | Sitemap uses trailing slashes; necklace product URLs in nav have no trailing slash — server likely redirects, but worth verifying no redirect chains |

### 1.2 Sitemap Gaps
The sitemap at `https://goldcoronado.com/sitemap.xml` is **missing 4 necklace product pages** that exist on the live site:

- `/products/cadena-perlas-doradas/` (Golden Pearls Necklace)
- `/products/cadena-gota-lumiere/` (Lumiere Drop Necklace)
- `/products/cadena-halo-brillante/` (Brilliant Halo Necklace)
- `/products/cadena-corazon-lumiere/` (Lumiere Heart Necklace)

Additionally, policy pages (`/privacy-policy/`, `/shipping-policy/`, `/terms-of-service/`) are included in the sitemap but add no SEO value and dilute crawl budget. Consider removing them.

### 1.3 Broken Links & 404s
| URL | Issue | Source |
|-----|-------|--------|
| `/category/earrings` | **404 Not Found** | Navigation menu on all pages |
| `/og-image.jpg` | **404 Not Found** | All pages (OG/Twitter meta tags) |

### 1.4 Security Headers
| Header | Status |
|--------|--------|
| Content-Security-Policy | ✅ Present (upgrade-insecure-requests) |
| Strict-Transport-Security | ✅ max-age=31536000 + preload |
| X-Frame-Options | ✅ SAMEORIGIN |
| X-Content-Type-Options | ✅ nosniff |
| Referrer-Policy | ✅ strict-origin-when-cross-origin |
| Permissions-Policy | ✅ camera/mic/geo/payment restricted |
| Cache-Control | ❌ Missing — no caching headers returned for HTML |

### 1.5 Performance Infrastructure
- Server: LiteSpeed (Hostinger) — HTTP/3 (QUIC) enabled via `alt-svc` header ✅
- No Cache-Control header on HTML responses — browser can't cache pages ❌
- TTFB: ~298ms — acceptable for shared hosting

---

## 2. Content Quality

### 2.1 Thin Content (Critical)
Product pages contain approximately **96 words of visible content** — far below the minimum recommended ~300 words for e-commerce product pages, and dramatically below the 500+ words that compete well in fine jewelry search.

| Page Type | Word Count | Target | Status |
|-----------|-----------|--------|--------|
| Homepage | ~492 | 500+ | ⚠️ Borderline |
| Category pages | ~400 | 400+ | ⚠️ Just adequate |
| Product pages | ~96 | 300+ | ❌ Critically thin |

This thin content is the **#1 ranking blocker**. Google has little text to parse for topical relevance and user intent matching.

### 2.2 Content Gaps
- No blog or editorial content (buyers searching "gold ring buying guide", "14k vs 18k gold", "handcrafted jewelry Miami" etc. have nowhere to land)
- No customer reviews displayed on site (social proof + UGC content)
- No named artisan or "About the Brand" story page
- No size guide, metal care guide, or jewelry education content
- Category pages have no descriptive introductory text — just a product grid

### 2.3 E-E-A-T Assessment
| Signal | Status |
|--------|--------|
| Author/brand identity | ⚠️ Weak — no named artisan, no dedicated About page |
| Physical address | ✅ Present in schema and footer |
| Phone/email | ✅ Present |
| Social proof | ❌ No reviews, no testimonials visible |
| Press/media mentions | ❌ None detectable |
| Certifications/trust badges | ❌ None visible |

### 2.4 Readability
Content that exists is well-written and luxury-appropriate. Tone is consistent. The French product names (Lumiere, Eclat, Trefle, Feuille) are on-brand but may confuse English-language search queries — consider adding English descriptor text alongside them on product pages.

---

## 3. On-Page SEO

### 3.1 Title Tags
| Page | Length | Status |
|------|--------|--------|
| Homepage | 57 chars | ✅ Good |
| Rings Category | 21 chars | ❌ Too short — "RINGS — Coronado Gold" is not descriptive |
| Necklaces Category | 25 chars | ❌ Too short |
| Coeur Lumiere (Sophisticated) | 61 chars | ⚠️ At limit |
| All other product pages | 33–43 chars | ⚠️ Could be enriched with material keywords |

Recommended category title format:  
`Gold Rings — Handcrafted 14k & 18k Jewelry | Coronado Gold` (58 chars)

### 3.2 Meta Descriptions
| Page | Length | Status |
|------|--------|--------|
| Homepage | 165 chars | ❌ Over 160 char limit — will be truncated |
| Most product pages | 125–154 chars | ✅ Acceptable range |
| Eclat de Lumiere Ring | 125 chars | ⚠️ On the short side |

### 3.3 Heading Structure
- **Homepage H1:** `Coronado Gold — Fine Gold Jewelry | Handcrafted Rings & Necklaces` — ✅ visually hidden (sr-only), SEO-accessible
- **Category pages H1:** Appears duplicated in the DOM ("RINGS" twice) — ❌ likely a render artifact; should be exactly one H1
- **Product pages H1:** Product name — ✅ appropriate
- **No H2/H3 hierarchy** on product pages — missed opportunity for keyword-rich subheadings ("Materials & Craftsmanship", "Product Details", "Care Instructions")
- **Shipping policy page:** No H1 found — ❌

### 3.4 Internal Linking
- Homepage links to 11 unique internal pages ✅
- Category pages link to individual products ✅
- Product pages link back to category via breadcrumb ✅
- No "Related Products" or cross-product internal links ❌
- Earrings nav link is broken (404) ❌

### 3.5 URL Structure
- Ring products: `/products/[english-name]/` — clean, descriptive ✅
- Necklace products: `/products/cadena-[spanish-name]/` — Spanish URLs create keyword mismatch ⚠️
  - `/products/cadena-perlas-doradas` → should ideally be `/products/golden-pearls-necklace`
  - `/products/cadena-gota-lumiere` → should ideally be `/products/lumiere-drop-necklace`

---

## 4. Schema / Structured Data

### 4.1 Implemented Schemas
| Schema Type | Page | Status |
|-------------|------|--------|
| Organization | Homepage | ✅ Valid — includes address, phone, email, sameAs |
| WebSite | Homepage | ✅ Present |
| Product | All product pages | ✅ Present |
| BreadcrumbList | All product + category pages | ⚠️ Bug on necklace products |
| ItemList | Category pages | ✅ Present |

### 4.2 Schema Issues

**Product Schema — Missing Fields:**
- `sku` — not included (recommended for rich results)
- `aggregateRating` — absent (no review system = no star ratings in SERPs)
- `offers.priceValidUntil` — missing (recommended by Google)
- `offers.itemCondition` — missing (`NewCondition`)

**BreadcrumbList Bug (Critical for necklaces):**
All 4 necklace products (`cadena-*`) display `Rings` as the parent category in both the visible breadcrumb and schema JSON-LD. Root cause: the handle pattern detection in `src/pages/products/[product].astro:95–97` checks for `"necklace"`, `"collar"`, `"chain"` but misses the Spanish word `"cadena"` (which means chain/necklace).

Fix: add `"cadena"` to the necklace handle detection condition.

**WebSite Schema — Missing SearchAction:**
A `SearchAction` potential action would enable Google Sitelinks Searchbox.

**Homepage — Missing LocalBusiness Schema:**
The brand has a physical address. A `JewelryStore` schema would qualify for local pack visibility.

### 4.3 Schema Validation
No structural JSON parsing errors detected on any page. All schemas are syntactically valid.

---

## 5. Performance

### 5.1 Server Response
- TTFB: ~298ms (acceptable for Hostinger shared hosting)
- HTTP/3 support via LiteSpeed ✅
- Page sizes: 74–149KB HTML

### 5.2 Resource Audit
| Metric | Value | Assessment |
|--------|-------|------------|
| External scripts | 3 | Low ✅ |
| Stylesheets | 2 | Low ✅ |
| Images with lazy loading | 22/24 | Good ✅ |
| Images without alt text | 0/24 | ✅ |
| Image format | WebP (Astro-optimized) | ✅ |
| Width/height attributes | Present | No CLS risk ✅ |
| Hero/above-fold image loading | lazy | ❌ Should be eager |

### 5.3 Core Web Vitals (Estimated)
- **LCP:** Moderate risk — hero images loaded from Shopify CDN via `loading="lazy"`. Above-fold product image should use `loading="eager"` with `<link rel="preload">`.
- **CLS:** Low risk — explicit dimensions present on images
- **INP:** Low risk — minimal JS, React island only for cart sidebar

### 5.4 Caching
- No `Cache-Control` header on HTML responses — each visit hits the origin server
- Shopify CDN serves product images with proper caching ✅

---

## 6. Images

| Check | Status |
|-------|--------|
| Alt text on all images | ✅ All product images have descriptive alt text |
| Lazy loading | ✅ 22/24 images lazy-loaded |
| Modern format (WebP) | ✅ Astro converts Shopify images to WebP at build time |
| Explicit dimensions | ✅ width/height attributes present on all images |
| OG image (`/og-image.jpg`) | ❌ **404 Not Found** |
| Hero image eager loading | ❌ Hero images are lazy-loaded — LCP risk |
| Product images CDN | ✅ Shopify CDN with CDN resizing applied |

---

## 7. AI Search Readiness

### 7.1 llms.txt
- `https://goldcoronado.com/llms.txt` accessible ✅
- Well-structured with brand description, products, contact, sitemap link ✅
- Missing: individual product URLs and descriptions ⚠️
- Missing: pricing information ⚠️
- Missing: full product catalog (necklace products not listed) ❌

### 7.2 AI Crawler Access
- robots.txt allows all user agents including GPTBot, Claude-Web ✅
- No blocking of AI crawlers

### 7.3 Citability Signals
- Brand name used consistently across all pages ✅
- Physical address present in schema and footer ✅
- No FAQ content for AI to cite ❌
- No editorial/blog content for topical authority ❌
- Structured Product data aids AI catalog understanding ✅

---

## 8. Local SEO

The brand has a physical retail location at 49 W 3rd St, Hialeah, FL 33010.

| Signal | Status |
|--------|--------|
| LocalBusiness / JewelryStore schema | ❌ Missing — only Organization schema present |
| Physical address in footer | ✅ |
| Phone number | ✅ |
| Google Business Profile | Not detectable — verify claimed and optimized |
| Local keyword targeting | ❌ No content targeting "jewelry store Hialeah" or "Miami gold jewelry" |

---

## Appendix: Full Crawl Summary

| URL | Status | Title Len | Desc Len | H1 | Key Issues |
|-----|--------|-----------|----------|----|------------|
| / | 200 | 57ch ✅ | 165ch ❌ | ✅ | Desc too long |
| /category/rings/ | 200 | 21ch ❌ | 143ch ✅ | Duplicated | Title too short, H1 dup |
| /category/necklaces/ | 200 | 25ch ❌ | 145ch ✅ | Duplicated | Title too short, H1 dup |
| /products/brilliant-woven-ring/ | 200 | 36ch ✅ | 147ch ✅ | ✅ | Thin content |
| /products/coeur-de-lumiere-ring/ | 200 | 37ch ✅ | 150ch ✅ | ✅ | Thin content |
| /products/coeur-de-lumiere-ring-sophisticated-version/ | 200 | 61ch ⚠️ | 150ch ✅ | ✅ | Thin content |
| /products/eclat-de-lumiere-ring/ | 200 | 37ch ✅ | 125ch ⚠️ | ✅ | Thin content |
| /products/feuille-de-lumiere-ring/ | 200 | 39ch ✅ | 143ch ✅ | ✅ | Thin content |
| /products/ghost-de-lumiere-ring/ | 200 | 37ch ✅ | 134ch ✅ | ✅ | Thin content |
| /products/infini-de-lumiere-ring/ | 200 | 38ch ✅ | 151ch ✅ | ✅ | Thin content |
| /products/intertwined-hearts-ring/ | 200 | 39ch ✅ | 154ch ✅ | ✅ | Thin content |
| /products/lumiere-knot-ring/ | 200 | 33ch ✅ | 131ch ✅ | ✅ | Thin content |
| /products/ruche-de-lumiere-ring/ | 200 | 37ch ✅ | 152ch ✅ | ✅ | Thin content |
| /products/trefle-de-lumiere-ring/ | 200 | 38ch ✅ | 153ch ✅ | ✅ | Thin content |
| /products/coeur-noire-de-lumiere-ring/ | 200 | 43ch ✅ | 154ch ✅ | ✅ | Thin content |
| /products/cadena-perlas-doradas | 200 | 38ch ✅ | 153ch ✅ | ✅ | Wrong breadcrumb, not in sitemap |
| /products/cadena-gota-lumiere | 200 | 37ch ✅ | 136ch ✅ | ✅ | Wrong breadcrumb, not in sitemap |
| /products/cadena-halo-brillante | 200 | 39ch ✅ | 150ch ✅ | ✅ | Wrong breadcrumb, not in sitemap |
| /products/cadena-corazon-lumiere | 200 | 38ch ✅ | 142ch ✅ | ✅ | Wrong breadcrumb, not in sitemap |
| /category/earrings | **404** | — | — | — | Linked from nav |
| /og-image.jpg | **404** | — | — | — | Referenced by all pages |
