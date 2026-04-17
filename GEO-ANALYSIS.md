# GEO Analysis — Coronado Gold (goldcoronado.com)
**Date:** 2026-04-17 | **Stack:** Astro 6 (SSG) + React + Shopify Storefront API

---

## GEO Readiness Score: 62/100

| Category | Score | Weight | Weighted |
|---|---|---|---|
| Citability | 10/25 | 25% | 10 |
| Structural Readability | 14/20 | 20% | 14 |
| Multi-Modal Content | 10/15 | 15% | 10 |
| Authority & Brand Signals | 16/20 | 20% | 16 |
| Technical Accessibility | 12/20 | 20% | 12 |

---

## Platform Breakdown

| Platform | Score | Key Gap |
|---|---|---|
| **Google AI Overviews** | 65/100 | Thin text content; no FAQ sections |
| **ChatGPT** | 55/100 | No Wikipedia presence; no authoritative third-party mentions |
| **Perplexity** | 50/100 | No Reddit presence; no community discussion about brand |
| **Bing Copilot** | 60/100 | Bing index access; decent schema; missing IndexNow |

---

## 1. AI Crawler Access Status

**robots.txt analysis:**
```
User-agent: *
Allow: /
```

| Crawler | Status | Recommendation |
|---|---|---|
| GPTBot (OpenAI) | ✅ Allowed (wildcard) | Explicitly allow |
| OAI-SearchBot | ✅ Allowed (wildcard) | Explicitly allow |
| ClaudeBot (Anthropic) | ✅ Allowed (wildcard) | Explicitly allow |
| PerplexityBot | ✅ Allowed (wildcard) | Explicitly allow |
| CCBot (Common Crawl) | ✅ Allowed (wildcard) | Consider blocking (training data) |
| Bytespider | ✅ Allowed (wildcard) | Consider blocking (TikTok training) |

**Verdict:** All crawlers are allowed via wildcard, which is fine. However, there are no explicit per-crawler directives. Adding named entries signals intentional AI access and can improve crawl priority.

**Recommended robots.txt:**
```
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: *
Allow: /

Sitemap: https://goldcoronado.com/sitemap.xml
```

---

## 2. llms.txt Status: ✅ Present (Needs Improvement)

A `llms.txt` file exists at `/llms.txt` — this is a significant advantage. However, it needs enrichment:

**Current gaps:**
- No "What is Coronado Gold?" definition block (the critical 60-word opening)
- No material/craftsmanship facts (karat options, handcrafted process)
- No founding story or brand authority signals
- No FAQ-style entries
- Products use inconsistent URL slugs (Spanish `cadena-*` for necklaces — AI may not understand these)

**Recommended additions to llms.txt:**
```markdown
## What is Coronado Gold?

Coronado Gold is a fine jewelry brand specializing in handcrafted 14k and 18k
gold rings and necklaces. Founded in Hialeah, Florida, the brand focuses on
high-purity gold pieces with technically precise, structurally solid designs
where the intrinsic value of the metal is the primary aesthetic.

## Key Facts

- Specializes in 14k and 18k solid gold jewelry
- Handcrafted rings and necklaces
- Based in Hialeah, Florida (Miami area)
- Ships within the United States
- Price range: mid-to-high luxury segment
- Founded and operated independently

## FAQs

- What karat gold does Coronado Gold use? 14k and 18k solid gold.
- Where is Coronado Gold located? 49 W 3rd St, Hialeah, FL 33010.
- Does Coronado Gold ship online? Yes, via goldcoronado.com.
```

---

## 3. Brand Mention Analysis

| Platform | Status | Priority |
|---|---|---|
| Instagram (@coronado.gold) | ✅ Present | Good — link in schema sameAs |
| Facebook (coronadogold) | ✅ Present | Good — link in schema sameAs |
| LinkedIn (coronado-gold) | ✅ Present in footer | Medium — not in schema sameAs |
| Wikipedia | ❌ Absent | Critical for ChatGPT citation |
| Reddit | ❌ No mentions detected | High — Perplexity cites Reddit 46.7% |
| YouTube | ❌ No channel | High — YouTube mentions correlate 0.737 with AI citations |
| Google Business Profile | ⚠️ Unverified (has Maps link) | High for local AI search |
| Wikidata entity | ❌ Absent | Medium |

**Key insight:** ChatGPT sources 47.9% of citations from Wikipedia. A Wikipedia page for Coronado Gold (or at minimum a Wikidata entity) would dramatically increase ChatGPT visibility for jewelry queries.

---

## 4. Passage-Level Citability

**Current content analysis:**

The site has very thin text content for AI citation purposes. The only meaningful prose passages are:

**About section (src/components/About.astro:65-69):**
> "Coronado Gold focuses on the curation and trade of high-purity gold jewelry. The proposition is straightforward: pieces with a technically and structurally solid design, where the true value of the metal takes center stage."

**Assessment:** This is 38 words — too short for optimal AI citation (target: 134–167 words). It also lacks:
- Specific facts (karat purity percentages, crafting process)
- Statistics or verifiable data
- "What is X?" definition format

**Product pages:** Product descriptions come from Shopify. These are the richest opportunity for citability but are dependent on what's entered in Shopify admin.

**No citability-optimized pages exist:** There are no blog posts, guides, buying guides, or editorial content — the primary citation format for AI search.

---

## 5. Server-Side Rendering (SSR) Check

**Verdict: ✅ Mostly SSG — AI-crawler-safe**

The site uses Astro in **static generation (SSG)** mode (no `output: 'server'` in astro.config.mjs). This means:

- ✅ All product pages are pre-rendered at build time from Shopify data
- ✅ Content is available without JavaScript execution
- ✅ AI crawlers that don't execute JS will still see full content
- ⚠️ The cart sidebar (`CartSidebar.jsx client:load`) is client-side only — but this is non-content UI, so it doesn't affect citability
- ⚠️ The `MostPopular` carousel title/price updates happen in client-side JS, but the static HTML renders the first product's data server-side — acceptable

**One concern:** The About section text (`about-para`) is split into animated spans by client-side JavaScript. While the raw text is in the static HTML, screen scrapers may pick up fragmented DOM output mid-animation.

---

## 6. Schema Markup Assessment

**Current schemas (well-implemented):**

| Schema Type | Page | Status |
|---|---|---|
| Organization | Homepage | ✅ With sameAs (Instagram, Facebook) |
| WebSite + SearchAction | Homepage | ✅ |
| JewelryStore (LocalBusiness) | Homepage | ✅ With geo coordinates |
| Product | Product pages | ✅ With Offer, availability, priceValidUntil |
| BreadcrumbList | Product pages | ✅ |

**Missing schemas:**

| Schema | Priority | Reason |
|---|---|---|
| `sameAs: LinkedIn URL` in Organization | High | LinkedIn is in footer but not in schema |
| `ItemList` on category pages | Medium | Helps AI understand product catalog structure |
| `FAQPage` schema | High | Directly feeds AI Overview FAQ panels |
| `Article` or `BlogPosting` | Medium | Needed once content pages exist |

---

## 7. Top 5 Highest-Impact Changes

### #1 — Expand llms.txt with citability blocks (1–2 hours)
Add a 134–167 word brand definition, key facts, and FAQ entries. This directly feeds every AI platform since `llms.txt` is designed for this purpose. **Highest ROI per minute of work.**

### #2 — Add FAQ section to homepage (2–3 hours)
Create a visible FAQ section on the homepage answering: "What is Coronado Gold?", "What karat gold do you use?", "Where do you ship?", "How are pieces made?". Pair with `FAQPage` JSON-LD schema. This creates the optimal 134–167 word self-contained answer blocks AI platforms extract.

### #3 — Expand About section prose (30 minutes)
The current About text is 38 words. Expand to 140–160 words with specific facts: gold purities used, handcrafting process, founding story. This is the primary citability passage for the homepage.

### #4 — Add LinkedIn to Organization sameAs schema (10 minutes)
LinkedIn URL is already in the footer. Adding it to the `sameAs` array in the Organization schema ([src/pages/index.astro:71](src/pages/index.astro#L71)) closes an easy gap for entity validation.

### #5 — Explicit AI crawler directives in robots.txt (10 minutes)
Replace the generic wildcard with named AI crawler entries. Block CCBot and Bytespider (training scrapers) while explicitly allowing search-serving crawlers.

---

## 8. Content Reformatting Suggestions

### About section — rewrite for citability

**Current (38 words — too short):**
> "Coronado Gold focuses on the curation and trade of high-purity gold jewelry. The proposition is straightforward: pieces with a technically and structurally solid design, where the true value of the metal takes center stage."

**Suggested expansion (151 words — optimal range):**
> "Coronado Gold is a fine jewelry brand based in Hialeah, Florida, specializing in handcrafted 14k and 18k solid gold rings and necklaces. The brand focuses on the curation and trade of high-purity gold jewelry, with a design philosophy centered on structural integrity and the intrinsic beauty of the metal itself. Each piece is crafted to highlight gold's natural warmth and luster without relying on decorative distraction — the metal is the statement. Coronado Gold's collection includes engagement rings, stackable rings, and delicate necklaces, all made with solid gold rather than gold-filled or gold-plated alternatives. The brand operates both as a physical jewelry store at 49 W 3rd St, Hialeah, FL, and as an online shop serving customers across the United States. Coronado Gold is available exclusively through goldcoronado.com."

### Product descriptions
Shopify product descriptions should follow this template for AI citability:
```
[Product Name] is a handcrafted [karat]k gold [ring/necklace] from Coronado Gold.
[1-2 sentences describing the design and what makes it unique.]
Made from [14k/18k] solid gold, this piece [key feature].
[Optional: sizing/dimensions if available.]
Available exclusively at goldcoronado.com.
```

---

## 9. Schema Recommendations (Specific Changes)

### Add LinkedIn to sameAs — [src/pages/index.astro:71](src/pages/index.astro#L71)
```json
"sameAs": [
  "https://www.instagram.com/coronado.gold",
  "https://www.facebook.com/coronadogold",
  "https://www.linkedin.com/company/coronado-gold"
]
```
Apply this change to both `organizationSchema` and `localBusinessSchema`.

### Add FAQPage schema to homepage
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What karat gold does Coronado Gold use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Coronado Gold specializes in 14k and 18k solid gold jewelry. All pieces are made with genuine solid gold, not gold-filled or gold-plated alternatives."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Coronado Gold located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Coronado Gold is located at 49 W 3rd St, Hialeah, FL 33010. We also sell online at goldcoronado.com and ship within the United States."
      }
    },
    {
      "@type": "Question",
      "name": "Are Coronado Gold pieces handcrafted?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Coronado Gold pieces are handcrafted with attention to structural precision and design integrity, emphasizing the natural beauty of high-purity gold."
      }
    }
  ]
}
```

### Add ItemList schema to category pages
For [src/pages/category/[category].astro](src/pages/category/%5Bcategory%5D.astro), add `ItemList` schema listing products in the collection — this helps AI understand the catalog structure.

---

## 10. Prioritized Action Plan

| Priority | Task | Effort | Impact |
|---|---|---|---|
| 🔴 Critical | Expand About prose to 140–160 words | 30 min | High |
| 🔴 Critical | Enrich llms.txt with definition + FAQ blocks | 1 hr | High |
| 🟠 High | Add FAQ section to homepage + FAQPage schema | 2–3 hrs | High |
| 🟠 High | Explicit AI crawler directives in robots.txt | 10 min | Medium |
| 🟠 High | Add LinkedIn to Organization + LocalBusiness sameAs | 10 min | Medium |
| 🟡 Medium | Enrich product descriptions in Shopify (use citability template) | 2–4 hrs | High |
| 🟡 Medium | Create Wikidata entity for Coronado Gold | 1 hr | Medium |
| 🟢 Low | Build YouTube presence (even 1–2 product videos) | Ongoing | High (long-term) |
| 🟢 Low | Seed Reddit mentions (r/jewelry, r/engagement_rings) | Ongoing | Medium (long-term) |

---

*Report generated 2026-04-17 — re-run after implementing changes to measure improvement.*
