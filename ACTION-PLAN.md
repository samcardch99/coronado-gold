# SEO Action Plan — goldcoronado.com
**Generated:** 2026-04-17  
**Overall Score:** 34/100

---

## CRITICAL — Fix Immediately (Blocking Indexing)

### 1. Add robots.txt
**File:** `public/robots.txt`  
**Effort:** 5 minutes  
**Impact:** Crawlability, trust signal for all search engines

```
User-agent: *
Allow: /

Sitemap: https://goldcoronado.com/sitemap-index.xml
```

---

### 2. Add XML Sitemap
**File:** `astro.config.mjs`  
**Effort:** 30 minutes  
**Impact:** Google discovers all pages faster, improves indexation rate

Install and configure `@astrojs/sitemap`:
```bash
npm install @astrojs/sitemap
```

Update `astro.config.mjs`:
```js
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://goldcoronado.com',
  integrations: [react(), sitemap()],
  // ... rest of config
});
```

---

### 3. Fix /category/earrings → 404
**File:** `src/pages/category/[category].astro`  
**Effort:** 30 minutes (+ Shopify collection setup)  
**Impact:** Fixes broken internal link, enables earrings category to rank

Add earrings to `getStaticPaths()`:
```js
{ params: { category: "earrings" }, props: { title: "EARRINGS", handle: "earrings" } }
```
Ensure a corresponding Shopify collection with handle `earrings` exists.

---

## HIGH — Fix Within 1 Week

### 4. Add Meta Descriptions to All Pages
**File:** `src/layouts/Layout.astro`  
**Effort:** 1-2 hours  
**Impact:** Click-through rates in SERP, social sharing previews

Pass description as a prop to Layout and add to `<head>`:
```astro
---
const { title, description } = Astro.props;
---
<meta name="description" content={description || "Shop handcrafted gold jewelry — rings, necklaces and earrings by Coronado Gold."} />
```

Then pass descriptive descriptions from each page:
- Homepage: `"Discover Coronado Gold's handcrafted fine gold jewelry collection. Shop rings, necklaces, and earrings crafted with precision and elegance."`
- Product pages: Use first 155 characters of `product.description`
- Category pages: `"Shop our collection of gold {category}. Handcrafted fine jewelry by Coronado Gold."`

---

### 5. Add Canonical Tags
**File:** `src/layouts/Layout.astro`  
**Effort:** 30 minutes  
**Impact:** Prevents duplicate content penalties from trailing-slash variants

```astro
<link rel="canonical" href={new URL(Astro.url.pathname, "https://goldcoronado.com").toString()} />
```

---

### 6. Add H1 Tags to Every Page
**Effort:** 1 hour  
**Impact:** Heading structure is a ranking signal

- Homepage: Add `<h1 class="sr-only">Coronado Gold — Fine Gold Jewelry</h1>` (visually hidden but crawlable)
- Product pages: Change product title element from `<h2>` to `<h1>`
- Category pages: Change category title from `<h2>` or `<p>` to `<h1>`

---

### 7. Add Open Graph + Twitter Card Meta Tags
**File:** `src/layouts/Layout.astro`  
**Effort:** 1 hour  
**Impact:** Rich previews when links are shared on social media (critical for jewelry brand)

```astro
---
const { title, description, image } = Astro.props;
const ogImage = image || "https://goldcoronado.com/og-default.jpg";
const ogTitle = title ? `${title} — Coronado Gold` : "Coronado Gold";
---
<meta property="og:title" content={ogTitle} />
<meta property="og:description" content={description || "Handcrafted fine gold jewelry."} />
<meta property="og:image" content={ogImage} />
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url.toString()} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={ogTitle} />
<meta name="twitter:description" content={description || "Handcrafted fine gold jewelry."} />
<meta name="twitter:image" content={ogImage} />
```

Create a default OG image (`public/og-default.jpg`) — 1200×630px with brand imagery.

---

### 8. Fix Homepage Title Tag — Add Keywords
**File:** `src/layouts/Layout.astro`  
**Effort:** 10 minutes  
**Impact:** Primary keyword signal for homepage

Change fallback title from `"Coronado Gold"` to `"Coronado Gold — Handcrafted Gold Jewelry | Rings & Necklaces"` (under 60 chars preferred, but descriptive).

---

### 9. Fix Broken Facebook Link
**File:** `src/components/Footer.astro`  
**Effort:** 5 minutes

Change `href="facebook.com"` to `href="https://www.facebook.com/coronadogold"` (or actual Facebook URL).

---

### 10. Add Product Schema (JSON-LD) to Product Pages
**File:** `src/pages/products/[product].astro`  
**Effort:** 2-3 hours  
**Impact:** Price, availability, and ratings shown directly in Google search results — highest ROI schema for e-commerce

Add to `<head>` in product page layout:
```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.title,
  "description": product.description,
  "image": mainImage?.url,
  "brand": {
    "@type": "Brand",
    "name": "Coronado Gold"
  },
  "offers": {
    "@type": "Offer",
    "price": product.priceRange.minVariantPrice.amount,
    "priceCurrency": product.priceRange.minVariantPrice.currencyCode,
    "availability": product.variants.edges[0]?.node.quantityAvailable > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    "url": `https://goldcoronado.com/products/${product.handle}/`
  }
})} />
```

---

## MEDIUM — Fix Within 1 Month

### 11. Fix Hero Image LCP
**File:** `src/components/Cover.astro`  
**Effort:** 15 minutes  
**Impact:** LCP improvement — potentially significant

Change the hero `<img>` from `loading="lazy"` to `loading="eager" fetchpriority="high"`.

---

### 12. Add Organization Schema to Homepage
**File:** `src/pages/index.astro` or Layout  
**Effort:** 1 hour

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Coronado Gold",
  "url": "https://goldcoronado.com",
  "logo": "https://goldcoronado.com/logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-786-367-7012",
    "contactType": "customer service",
    "email": "coronadogoldjewelry@gmail.com"
  },
  "sameAs": [
    "https://www.instagram.com/coronado.gold"
  ]
}
```

---

### 13. Add BreadcrumbList Schema to Product/Category Pages
**Effort:** 1-2 hours  
**Impact:** Breadcrumb trails in search results

---

### 14. Add Security Headers via Hostinger Configuration
**Effort:** 1 hour (Hostinger hPanel)  
**Impact:** User trust, Chrome security indicators

Add via `.htaccess` or Hostinger's header management:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

### 15. Optimize JavaScript Bundle
**Effort:** 4-8 hours  
**Impact:** INP and TTI improvements

- Move `CartSidebar` from `client:load` to `client:idle` (loads after page interactive)
- Evaluate if GSAP can be replaced with CSS animations for simpler effects
- Add `client:visible` to Swiper components (only hydrate when in viewport)
- Consider removing or code-splitting Lenis on mobile

---

### 16. Make About Section Content Crawlable
**Effort:** 2-3 hours  
**Impact:** Content indexation, E-E-A-T signals

The about section uses JavaScript animation that hides text until the animation runs. Ensure the actual text content is in the static HTML (not just injected by JS), and the animation only affects visual presentation.

---

### 17. Improve Homepage Title with Location/Keywords
**Effort:** 15 minutes

If the brand targets a specific region, add it: `"Coronado Gold — Fine Gold Jewelry | Miami, FL"`

---

## LOW — Backlog

### 18. Create a Brand Story / About Page
A dedicated `/about` page improves E-E-A-T and gives Google more context about the brand.

### 19. Add a Blog / Content Section
Target informational keywords: "how to care for gold jewelry", "gold ring sizing guide", "best gold jewelry for gifts". Each article is an organic traffic entry point.

### 20. Add Size Guide / Product FAQ
On product pages, add a collapsible FAQ section. This enables `FAQPage` schema and captures "zero-click" featured snippet positions.

### 21. Add llms.txt for AI Search
Create `public/llms.txt` to guide AI crawlers about the site's content and brand.

### 22. Register in Google Search Console
Submit sitemap after creating it. Monitor indexation status and search performance.

### 23. Set Up Google Analytics 4 Properly
The homepage HTML shows `G-9Q6H0QETRF` in a generic "This Page Does Not Exist" error template — this appears to be a hosting-level 404 page. Ensure GA4 is properly installed in the actual site's `<head>`.

---

## Summary Checklist

| # | Task | Priority | Effort | Done |
|---|---|---|---|---|
| 1 | Add robots.txt | Critical | 5 min | [ ] |
| 2 | Add sitemap.xml | Critical | 30 min | [ ] |
| 3 | Fix /category/earrings 404 | Critical | 30 min | [ ] |
| 4 | Add meta descriptions | High | 1-2 hr | [ ] |
| 5 | Add canonical tags | High | 30 min | [ ] |
| 6 | Add H1 to all pages | High | 1 hr | [ ] |
| 7 | Add OG + Twitter meta tags | High | 1 hr | [ ] |
| 8 | Fix homepage title keywords | High | 10 min | [ ] |
| 9 | Fix Facebook broken link | High | 5 min | [ ] |
| 10 | Add Product schema (JSON-LD) | High | 2-3 hr | [ ] |
| 11 | Fix hero image lazy loading | Medium | 15 min | [ ] |
| 12 | Add Organization schema | Medium | 1 hr | [ ] |
| 13 | Add Breadcrumb schema | Medium | 1-2 hr | [ ] |
| 14 | Add security headers | Medium | 1 hr | [ ] |
| 15 | Optimize JS bundle | Medium | 4-8 hr | [ ] |
| 16 | Fix about section crawlability | Medium | 2-3 hr | [ ] |
| 17 | Register Google Search Console | Low | 30 min | [ ] |
| 18 | Create About page | Low | 4 hr | [ ] |
| 19 | Add blog / content section | Low | Ongoing | [ ] |
| 20 | Add llms.txt | Low | 30 min | [ ] |
