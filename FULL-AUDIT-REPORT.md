# Full SEO Audit — goldcoronado.com
**Audit Date:** 2026-04-17  
**Business Type:** E-commerce — Fine Jewelry (Gold Rings, Necklaces)  
**Stack:** Astro v6 + Tailwind CSS + Shopify Storefront API (Headless)  
**Hosting:** Hostinger / LiteSpeed Server  

---

## SEO Health Score: 34 / 100

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Technical SEO | 25/100 | 22% | 5.5 |
| Content Quality | 30/100 | 23% | 6.9 |
| On-Page SEO | 35/100 | 20% | 7.0 |
| Schema / Structured Data | 0/100 | 10% | 0 |
| Performance (CWV) | 45/100 | 10% | 4.5 |
| AI Search Readiness | 20/100 | 10% | 2.0 |
| Images | 55/100 | 5% | 2.75 |
| **Total** | | | **28.65 → 34** |

> Score adjusted upward slightly to account for strong image alt text and valid HTTPS/HTTP2 delivery. However critical gaps in technical infrastructure cap the ceiling significantly.

---

## Executive Summary

**goldcoronado.com** is a headless Astro e-commerce site selling fine gold jewelry, powered by the Shopify Storefront API. The site has a visually polished design but suffers from **severe foundational SEO issues** that limit its ability to rank in Google search.

### Top 5 Critical Issues
1. **No sitemap.xml** — Google cannot efficiently discover or index pages
2. **No robots.txt** — Crawlers have no guidance; both return 404 pages
3. **No meta descriptions on any page** — Every page missing this ranking signal
4. **No canonical tags** — Duplicate content risk (trailing slash redirects confirm ambiguity)
5. **No structured data (Schema.org)** — Zero rich result eligibility for products, reviews, breadcrumbs

### Top 5 Quick Wins
1. Add `@astrojs/sitemap` integration — 30 minutes, massive crawlability impact
2. Add `robots.txt` to `/public/` — 5 minutes fix
3. Add meta descriptions to Layout.astro and all page templates
4. Add canonical `<link>` tags to Layout.astro
5. Fix broken Facebook social link (`href="facebook.com"` → absolute URL)

---

## Technical SEO

### Crawlability

| Check | Status | Notes |
|---|---|---|
| robots.txt | ❌ 404 | Returns HTML "Page Not Found" — no crawl guidance |
| sitemap.xml | ❌ 404 | Returns HTML "Page Not Found" — no sitemap |
| HTTPS | ✅ | Valid SSL, HTTP/2 active |
| Trailing slash | ⚠️ | `/products/brilliant-woven-ring` → 301 to trailing slash version. Consistent but creates redirect chain for internal links |
| /category/earrings | ❌ 404 | Linked from navbar, but not in `getStaticPaths()` — broken page |
| Internal href="#" | ⚠️ | Several `href="#"` anchor tags — not crawlable destinations |
| Facebook link | ❌ Broken | `href="facebook.com"` is a relative path, not an absolute URL |

**Findings:**
- The Astro config (`astro.config.mjs`) has no `@astrojs/sitemap` integration installed
- No `robots.txt` file exists in `/public/`
- The category page `getStaticPaths()` only defines `rings` and `necklaces` — `earrings` is linked in the navbar but returns 404

### Indexability

| Check | Status |
|---|---|
| Meta robots | ✅ No noindex found |
| X-Robots-Tag header | ✅ Not present (allows indexing) |
| Canonical tags | ❌ Missing on all pages |
| 301 redirect consistency | ⚠️ All non-trailing-slash URLs redirect — internal links should use trailing slash |

### Security Headers

| Header | Status |
|---|---|
| Content-Security-Policy | ⚠️ Only `upgrade-insecure-requests` — weak policy |
| Strict-Transport-Security (HSTS) | ❌ Missing |
| X-Frame-Options | ❌ Missing |
| X-Content-Type-Options | ❌ Missing |
| Referrer-Policy | ❌ Missing |
| Permissions-Policy | ❌ Missing |

Security headers do not directly impact rankings but Chrome security warnings can increase bounce rate and erode trust signals.

---

## Content Quality

### Homepage
- **Title:** `Coronado Gold` — generic, no keywords (e.g. "gold jewelry", "rings", location)
- **Meta Description:** ❌ Missing entirely
- **H1:** ❌ No H1 tag — only H2s exist (`Rings`, `Contact Us`, `Your Cart`)
- **About section text:** Text is rendered empty in static HTML (likely client-side JS animation using `about-reveal` classes) — Google may not index this content reliably
- **Body copy:** Very sparse text content on homepage — mostly image-driven with animated text reveals that may not render in Googlebot

### Product Pages
- **Title:** ✅ `{Product Name} — Coronado Gold` — good pattern
- **Meta Description:** ❌ Missing — product descriptions exist in data but not mapped to `<meta name="description">`
- **H1:** ❌ No H1 found on product page (product name appears in `<h2>` or `<p>`)
- **Description:** Product descriptions pulled from Shopify but not visible as crawlable static text in all cases

### Category Pages
- **Title:** ✅ `RINGS — Coronado Gold`
- **Meta Description:** ❌ Missing
- **H1:** ❌ Missing

### E-E-A-T Assessment
- **Experience:** No customer reviews, no testimonials, no user-generated content
- **Expertise:** No "About" page with brand story or credentials; about section text appears JS-only
- **Authoritativeness:** No blog, no press mentions, no external citations
- **Trustworthiness:** Contact info present (email + phone), privacy/shipping/terms pages exist ✅

### Thin Content Risk
- **High risk**: Homepage has very little indexable text (animated JS reveals)
- **Medium risk**: Category pages show product grids but minimal descriptive copy
- **Low risk**: Product pages have Shopify descriptions, which vary in length

---

## On-Page SEO

### Title Tags

| Page | Title | Issues |
|---|---|---|
| Homepage | `Coronado Gold` | ❌ No keywords, too short |
| Product pages | `{Name} — Coronado Gold` | ✅ Good, but could add "Gold Ring" keyword |
| Category pages | `RINGS — Coronado Gold` | ⚠️ All caps, no modifier keywords |
| Privacy/Shipping/Terms | Likely `{Page} — Coronado Gold` | Low priority |

### Meta Descriptions
❌ **Zero pages have meta descriptions.** The Layout.astro `<head>` does not include a `<meta name="description">` tag. This is a universal issue affecting every page on the site.

### Heading Structure
- Homepage: No `<h1>`, multiple `<h2>` tags (Rings, Contact Us, Your Cart)
- Each page should have exactly one `<h1>` describing the primary topic

### Internal Linking
- Homepage links to 8 specific products and 2 categories — reasonable depth
- No breadcrumbs on product/category pages
- Navigation links use `href="#section"` for single-page sections — good for UX but not ideal for SEO
- Earrings category linked but 404 — broken internal link

### Open Graph / Social Sharing
❌ **No OG tags found** (`og:title`, `og:description`, `og:image`) on any page — links shared on Facebook/Instagram/WhatsApp will not generate preview cards.

### Twitter/X Cards
❌ **No Twitter card meta tags** present.

---

## Schema & Structured Data

❌ **Zero structured data found on any page.**

### Missing Schema Opportunities

| Schema Type | Pages | Priority | Impact |
|---|---|---|---|
| `Organization` | Homepage | High | Brand knowledge panel, logo |
| `WebSite` with `SearchAction` | Homepage | Medium | Sitelinks search box |
| `Product` | All product pages | **Critical** | Price, availability, ratings in SERP |
| `BreadcrumbList` | Product + Category pages | High | Breadcrumb rich results |
| `ItemList` | Category pages | Medium | Enhanced category listings |
| `FAQPage` | Product pages (if FAQs added) | Low | FAQ rich results |

**Product schema is the highest priority** — without it, product pages cannot display price, availability, or star ratings directly in Google search results, which significantly reduces click-through rates for e-commerce.

---

## Performance (Core Web Vitals)

*Note: PageSpeed Insights API was unavailable during this audit. Estimates based on code analysis.*

### Estimated Issues

| Metric | Estimated Rating | Evidence |
|---|---|---|
| LCP | ⚠️ Needs Improvement | Hero image (`cover-bg.webp`) has `loading="lazy"` — should be `eager` for LCP candidate |
| CLS | ⚠️ Potential issues | Swiper carousel, animated text reveals, dynamic cart sidebar may cause layout shifts |
| INP | ⚠️ Unknown | Heavy JS bundle: GSAP, Lenis, Swiper, React (cart), EmailJS all loaded |
| FCP | ⚠️ Moderate | Multiple CSS files, no critical CSS inlining |

### JavaScript Bundle Concerns
- **GSAP** (animation library) — heavy, loaded globally
- **Lenis** (smooth scroll) — adds scroll overhead
- **Swiper** — loaded globally
- **React** (cart sidebar) — `client:load` means React hydrates on every page
- **EmailJS** — loaded on pages that may not use the contact form

### Resource Hints
- ❌ No `<link rel="preload">` for hero image
- ❌ No font preconnect to Google Fonts or CDNs
- ✅ Images use `loading="lazy"` appropriately for below-fold content
- ✅ Images use WebP format
- ✅ HTTP/2 active (multiplexing benefits)

---

## Images

| Check | Status | Notes |
|---|---|---|
| Alt text — product images | ✅ | All product images have descriptive alt text (product name) |
| Alt text — decorative images | ✅ | `about-1.webp`, `about-2.webp` have alt text |
| Hero image alt | ✅ | `alt="cover Background"` — acceptable, could be more descriptive |
| Image format | ✅ | All images served as WebP |
| Image dimensions | ✅ | Width/height attributes present |
| Hero image lazy loading | ❌ | LCP image has `loading="lazy"` — should be `loading="eager"` with `fetchpriority="high"` |
| OG images | ❌ | No OG image meta tags |

---

## AI Search Readiness (GEO)

| Check | Status |
|---|---|
| llms.txt | ❌ Missing |
| robots.txt allows AI crawlers | ❌ No robots.txt at all |
| Structured data for AI citation | ❌ No schema |
| Factual, citable content | ⚠️ Thin content limits citability |
| Brand mentions | ⚠️ No external authority signals found |
| AI crawler accessibility | Unknown (no robots.txt) |

The site is not optimized for AI search experiences (Google AI Overviews, ChatGPT, Perplexity). Without structured data, factual content, and proper crawl permissions, the site cannot be cited in AI-generated answers.

---

## Additional Issues Found

### Broken/Invalid Links
- `href="facebook.com"` in Footer — resolves to `goldcoronado.com/facebook.com` (relative path error)
- `/category/earrings` — returns 404, linked from homepage navigation

### Missing Pages
- No dedicated "About" page (only an in-page section)
- No blog/content section (limits organic keyword reach)
- No size guide / care instructions (common jewelry e-commerce trust signals)
- `earrings` category page not implemented despite being linked

### Accessibility (impacts SEO)
- Multiple `<h2>` tags without preceding `<h1>` breaks heading hierarchy
- Animated text reveals that rely entirely on JS for content visibility

---

## Action Plan

See [ACTION-PLAN.md](ACTION-PLAN.md) for the full prioritized list.
