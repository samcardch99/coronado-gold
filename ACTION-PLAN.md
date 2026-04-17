# SEO Action Plan — Coronado Gold
**Generated:** 2026-04-17  
**Overall Score:** 63/100  
**Target Score:** 80+/100

---

## CRITICAL — Fix Immediately

### C1. Fix Broken OG Image
**Impact:** Every page on the site references `/og-image.jpg` for social sharing. It returns 404.  
**Effort:** 30 minutes  

- Create a branded 1200×630px OG image (brand logo on a gold/dark background)
- Save as `public/og-image.jpg`
- Rebuild and redeploy

---

### C2. Fix Earrings Nav Link (404)
**Impact:** All pages link to `/category/earrings` which returns 404 — bad for UX and crawlers.  
**Effort:** 15 minutes  
**File:** `src/components/Navbar.astro`

Options:
- **If earrings category will exist:** Build the `/category/earrings` page (add to `getStaticPaths` in `src/pages/category/[category].astro`)
- **If not planned:** Remove the earrings link from the nav immediately

---

### C3. Fix Necklace Breadcrumb Bug
**Impact:** All 4 necklace products (`cadena-*`) show "Rings" as the parent category in the breadcrumb and in JSON-LD schema — misleads Google and users.  
**Effort:** 5 minutes  
**File:** `src/pages/products/[product].astro` — lines 95–97

Current code:
```ts
const breadcrumbCategory = productHandle.includes("necklace") || productHandle.includes("collar") || productHandle.includes("chain")
    ? { name: "Necklaces", handle: "necklaces" }
    : { name: "Rings", handle: "rings" };
```

Fix — add `"cadena"` to the condition:
```ts
const breadcrumbCategory = productHandle.includes("necklace") || productHandle.includes("collar") || productHandle.includes("chain") || productHandle.includes("cadena")
    ? { name: "Necklaces", handle: "necklaces" }
    : { name: "Rings", handle: "rings" };
```

Same fix applies to the `categoryQuote` logic on line 150 (already handles `"cadena"` there — verify the breadcrumb fix is also applied).

---

### C4. Add Necklace Products to Sitemap
**Impact:** 4 live necklace product pages are not in the sitemap — Google may not discover them.  
**Effort:** 10 minutes  
**File:** `public/sitemap.xml`

Add these URLs to the sitemap:
```xml
<!-- Necklace Products -->
<url>
  <loc>https://goldcoronado.com/products/cadena-perlas-doradas/</loc>
  <lastmod>2026-04-17</lastmod>
</url>
<url>
  <loc>https://goldcoronado.com/products/cadena-gota-lumiere/</loc>
  <lastmod>2026-04-17</lastmod>
</url>
<url>
  <loc>https://goldcoronado.com/products/cadena-halo-brillante/</loc>
  <lastmod>2026-04-17</lastmod>
</url>
<url>
  <loc>https://goldcoronado.com/products/cadena-corazon-lumiere/</loc>
  <lastmod>2026-04-17</lastmod>
</url>
```

---

## HIGH — Fix Within 1 Week

### H1. Fix Homepage Meta Description Length
**Impact:** 165-char description gets truncated in SERPs — wastes the CTA.  
**Effort:** 5 minutes  
**File:** `src/pages/index.astro` — line 44

Current (165 chars):
```
Discover Coronado Gold's fine gold jewelry — handcrafted rings, necklaces and more. Premium 14k and 18k gold pieces crafted with precision and elegance. Shop online.
```

Suggested (under 155 chars):
```
Coronado Gold — handcrafted 14k & 18k gold rings and necklaces made with precision and elegance. Shop fine jewelry online.
```

---

### H2. Improve Category Page Title Tags
**Impact:** "RINGS — Coronado Gold" (21 chars) is too short and misses ranking keywords.  
**Effort:** 10 minutes  
**File:** `src/pages/category/[category].astro`

Add descriptive meta descriptions to each category's `getStaticPaths` entry:

```ts
{ params: { category: "rings" }, props: { 
    title: "Gold Rings — Handcrafted 14k & 18k Jewelry", 
    handle: "rings",
    description: "Shop handcrafted gold rings in 14k and 18k gold. Elegant designs for every style and occasion. Free shipping on orders over $X." 
}},
{ params: { category: "necklaces" }, props: { 
    title: "Gold Necklaces — Handcrafted Fine Jewelry", 
    handle: "necklaces",
    description: "Discover Coronado Gold's handcrafted gold necklaces in 14k and 18k gold. Timeless designs for every occasion."
}},
```

---

### H3. Add LocalBusiness / JewelryStore Schema to Homepage
**Impact:** Required for local pack eligibility and AI citation of your business.  
**Effort:** 20 minutes  
**File:** `src/pages/index.astro`

Replace or extend the `organizationSchema` to use `JewelryStore` type:

```json
{
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": "Coronado Gold",
  "url": "https://goldcoronado.com",
  "logo": "https://goldcoronado.com/logo.svg",
  "image": "https://goldcoronado.com/og-image.jpg",
  "telephone": "+17863677012",
  "email": "coronadogoldjewelry@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "49 W 3rd St",
    "addressLocality": "Hialeah",
    "addressRegion": "FL",
    "postalCode": "33010",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 25.858,
    "longitude": -80.279
  },
  "openingHoursSpecification": [...],
  "sameAs": [
    "https://www.instagram.com/coronado.gold",
    "https://www.facebook.com/coronadogold"
  ],
  "priceRange": "$$"
}
```

---

### H4. Set Hero Image to Eager Loading
**Impact:** Improves LCP score — the hero product image is the likely Largest Contentful Paint element.  
**Effort:** 10 minutes  
**Files:** `src/components/Cover.astro`, `src/pages/products/[product].astro`

For the above-fold hero image:
```astro
<!-- Change from -->
<Image src={...} loading="lazy" ... />
<!-- To -->
<Image src={...} loading="eager" fetchpriority="high" ... />
```

Also add a `<link rel="preload">` hint in the `<head>` for the hero image.

---

### H5. Fix Duplicate H1 on Category Pages
**Impact:** Having two H1 tags confuses Google's understanding of page topic.  
**Effort:** 15 minutes  
**File:** `src/pages/category/[category].astro`

Identify the source of the duplicate H1 (likely rendered by both the Layout and the category component). Remove one — the visual heading should be `<h2>` or keep the `<h1>` and ensure only one appears in the final DOM.

---

### H6. Add SearchAction to WebSite Schema
**Impact:** Enables Google Sitelinks Searchbox in branded search results.  
**Effort:** 10 minutes  
**File:** `src/pages/index.astro`

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Coronado Gold",
  "url": "https://goldcoronado.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://goldcoronado.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## MEDIUM — Fix Within 1 Month

### M1. Expand Product Page Content (Thin Content)
**Impact:** Product pages have ~96 words. Aim for 300–500 words to compete for jewelry keywords.  
**Effort:** 2–4 hours (copywriting across 16 products)

For each product page, add:
- **Materials section:** "Crafted in [X]k gold with [stone/finish details]"
- **Style notes:** "Perfect for [occasions] — pairs well with [styles]"
- **Care instructions:** "Store in a dry place, clean with a soft cloth..."
- **Size/measurement info:** Ring size chart, necklace length guide
- **Occasion tags:** Anniversary, birthday, everyday wear

Update Shopify product descriptions — they'll pull through to the Astro product page automatically.

---

### M2. Add Category Page Intro Text
**Impact:** Category pages currently have zero descriptive text above the product grid.  
**Effort:** 1 hour  
**File:** `src/pages/category/[category].astro`

Add a 100–150 word introductory paragraph above the product grid on each category page:

```
"Our gold ring collection brings together handcrafted designs in 14k and 18k gold. Each piece is crafted with attention to detail, blending contemporary elegance with timeless craftsmanship. From delicate stackable bands to statement engagement styles, our rings are designed for everyday wear and special occasions alike. Explore the collection and find the piece that speaks to you."
```

---

### M3. Update llms.txt with Full Product Catalog
**Impact:** AI crawlers (ChatGPT, Perplexity, Claude) use this file for accurate brand citations.  
**Effort:** 30 minutes  
**File:** `public/llms.txt`

Add:
- Individual product URLs with names and prices
- All necklace products (currently missing)
- Pricing range information
- Current collection names

---

### M4. Add Product Schema Fields
**Impact:** More complete Product schema improves rich result eligibility.  
**Effort:** 30 minutes  
**File:** `src/pages/products/[product].astro`

Add to the `productSchema` object:
```ts
"sku": product.handle,
"offers": {
  ...currentOffers,
  "itemCondition": "https://schema.org/NewCondition",
  "priceValidUntil": "2026-12-31",
  "shippingDetails": {
    "@type": "OfferShippingDetails",
    "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" }
  }
}
```

---

### M5. Add H2/H3 Subheadings to Product Pages
**Impact:** Structural hierarchy helps Google parse product content and enables featured snippet capture.  
**Effort:** 1 hour  
**File:** `src/pages/products/[product].astro`

Add semantic headings to product page sections:
- `<h2>Product Details</h2>`
- `<h2>Materials & Craftsmanship</h2>`
- `<h2>How to Care for Your Jewelry</h2>`

---

### M6. Add H1 to Shipping Policy Page
**Impact:** Missing H1 on `/shipping-policy/` — minor but easily fixed.  
**Effort:** 5 minutes  
**File:** `src/pages/shipping-policy.astro`

Add `<h1>Shipping Policy</h1>` to the page content.

---

### M7. Consider Renaming Spanish Necklace URLs
**Impact:** `/products/cadena-perlas-doradas` won't rank for English searches like "golden pearls necklace".  
**Effort:** Medium — requires redirects from old URLs  

If renaming, implement 301 redirects from old handles to new English handles. Update Shopify product handles to English equivalents:
- `cadena-perlas-doradas` → `golden-pearls-necklace`
- `cadena-gota-lumiere` → `lumiere-drop-necklace`
- `cadena-halo-brillante` → `brilliant-halo-necklace`
- `cadena-corazon-lumiere` → `lumiere-heart-necklace`

---

## LOW — Backlog

### L1. Add Customer Reviews/Ratings
**Impact:** Enables `aggregateRating` schema → star ratings in SERPs. Also major E-E-A-T signal.  
**Effort:** Integration work (Shopify Reviews app or Judge.me)

### L2. Create Blog / Editorial Content
**Impact:** Capture informational searches; build topical authority.  
**Suggested topics:**
- "14k vs 18k Gold: Which Should You Choose?"
- "How to Care for Your Gold Jewelry"
- "The Story Behind Coronado Gold"
- "Gold Ring Buying Guide"
- "Best Gold Jewelry Gifts for Her"

### L3. Claim & Optimize Google Business Profile
**Impact:** Local search visibility — "gold jewelry store near me", "jewelry store Hialeah FL"  
**Action:** Verify GBP listing, add photos, hours, products, and gather reviews

### L4. Add "Related Products" Internal Linking
**Impact:** Better crawl distribution; higher pages-per-session  
**File:** `src/pages/products/[product].astro`  
Add a "You might also like" section at the bottom of each product page

### L5. Add HTML sitemap page
**Impact:** User-discoverable site structure; light SEO signal  
Create `/sitemap/` page listing all products and categories

### L6. Add HTML Cache-Control Headers via .htaccess
**Impact:** Browser caching for repeat visitors  
**File:** `public/.htaccess`  
Add cache headers for HTML, CSS, JS, images

### L7. Add `og:type` = `product` on Product Pages
**Impact:** More specific social sharing metadata  
Currently all pages use `og:type: website` — product pages should use `og:type: product` for Pinterest and Facebook product feeds

---

## Priority Summary Table

| ID | Issue | Priority | Effort | Impact |
|----|-------|----------|--------|--------|
| C1 | OG image 404 | Critical | 30min | High |
| C2 | Earrings 404 nav link | Critical | 15min | High |
| C3 | Necklace breadcrumb bug | Critical | 5min | High |
| C4 | Add necklaces to sitemap | Critical | 10min | High |
| H1 | Homepage meta desc too long | High | 5min | Medium |
| H2 | Category page titles too short | High | 10min | High |
| H3 | Add JewelryStore schema | High | 20min | Medium |
| H4 | Hero image eager loading | High | 10min | Medium |
| H5 | Fix duplicate H1 categories | High | 15min | Medium |
| H6 | WebSite SearchAction schema | High | 10min | Low |
| M1 | Expand product descriptions | Medium | 4hrs | Very High |
| M2 | Add category intro text | Medium | 1hr | High |
| M3 | Update llms.txt catalog | Medium | 30min | Medium |
| M4 | Product schema fields | Medium | 30min | Medium |
| M5 | H2/H3 on product pages | Medium | 1hr | Medium |
| M6 | Add H1 to shipping policy | Medium | 5min | Low |
| M7 | Rename Spanish necklace URLs | Medium | 2hrs | Medium |
| L1 | Customer reviews | Low | High effort | Very High |
| L2 | Blog content | Low | Ongoing | Very High |
| L3 | Google Business Profile | Low | 1hr | High (local) |
| L4 | Related products links | Low | 2hrs | Medium |
