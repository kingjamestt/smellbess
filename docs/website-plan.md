# smellbess.com: website plan

*Written Oct 2026 for the `website-mvp` branch. Source of truth order: `CLAUDE.md` → `website-brief.md` → `scent-lists.md` → `business-plan.md`. Where `CLAUDE.md` and the brief differ, `CLAUDE.md` wins (e.g., Tier A+ and the 10-scent launch lineup).*

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | Server components keep the JS sent to phones small (LCP < 2s on 4G). Static scent pages are good for SEO and WhatsApp/IG link previews. Runs on Vercel, Netlify and Cloudflare (via OpenNext). |
| Styling | **Tailwind CSS v4** | No runtime cost, fast to iterate, easy to keep a consistent, non-template look. |
| Business logic | **Pure TypeScript functions** in `web/src/lib/` (pricing, offers, stock, delivery) | Testable without a browser or database. The same functions run in the cart (for display) and on the server (the server always re-prices; it never trusts the cart). |
| Tests | **Vitest** | Fast, TypeScript-native, no config fuss. |
| Data | **Small data-access layer** (`web/src/lib/data/`) with a **JSON-file implementation** now | Runs with zero cloud services. A Supabase implementation can be dropped in later behind the same interface. |
| Later | **Supabase** (Postgres, auth for the 2 admins, storage for photos) | Matches the brief. Not created yet: no cloud accounts or projects in this phase. |

**Not used, on purpose:** no CMS, no state-management library, no UI kit, no payment SDK (no card payments in v1), no quiz, no voucher codes.

The app lives in **`web/`** so the business docs stay at the repo root. Every host supports a "root directory" setting.

---

## 2. Hosting options (owner decides)

| Option | Monthly cost | Commercial use on free plan? | Next.js support | Notes |
|---|---|---|---|---|
| **Vercel Hobby** | US$0 | **No.** Hobby is for personal, non-commercial projects only | Best (Vercel makes Next.js) | Not allowed for a shop. Listed only to rule it out |
| **Vercel Pro** | **US$20 per member** (1 member is enough; the second admin doesn't need a Vercel seat, they log in to the site's own admin) | Yes | Best: zero config, image optimisation, analytics, preview deploys | Simplest. ~TT$136/month is roughly 2 orders' contribution |
| **Cloudflare (Workers/Pages + OpenNext adapter)** | US$0 | Yes | Good via `@opennextjs/cloudflare`; a few Next features need care (image optimisation goes through Cloudflare Images or is turned off) | Fastest edge network in the Caribbean, free analytics, free DNS. Slightly more setup |
| **Netlify Free** | US$0 | Yes | Good (Netlify's Next.js runtime is OpenNext-based) | Free plan is credit-based; check the current limits before choosing. Builds and bandwidth are plenty for this traffic |

**Recommendation to discuss, not a decision:** start on **Cloudflare** or **Netlify free** while traffic is small, keep the code host-neutral (it is), and move to **Vercel Pro** if the setup time on the free hosts starts costing more than US$20/month of your time. *Verify the current plan terms on each provider's pricing page before signing up; they change.*

**Supabase free tier** pauses a project after ~7 days with no activity. Options: a daily scheduled ping (Cloudflare Cron Trigger, Netlify scheduled function or a GitHub Action), or Supabase Pro (US$25/mo) once orders are steady. Real orders every week will also keep it awake.

**Domain:** `smellbess.com` on Namecheap (not bought). Point DNS at the chosen host. If Cloudflare is chosen, move DNS to Cloudflare (free).

---

## 3. Data model

Everything below is in `web/src/lib/types.ts`. The JSON store holds the same shapes; the Supabase schema will mirror them one table per entity.

### Pricing and sizes (config, not per product)

```ts
type Tier = "A" | "A+" | "D1" | "D2" | "N";
type SizeMl = 5 | 10 | 15;               // no 2ml, no 30ml

const TIER_PRICES: Record<Tier, Record<SizeMl, number>> = {
  A:    { 5: 60,  10: 100, 15: 150 },
  "A+": { 5: 70,  10: 120, 15: 175 },
  D1:   { 5: 75,  10: 125, 15: 185 },
  D2:   { 5: 120, 10: 200, 15: 275 },
  N:    { 5: 100, 10: 180, 15: 250 },
};
```

A product never stores a decant price. Its price is always `TIER_PRICES[product.tier][size]`.

### Products (scent cards)

| Field | Type | Notes |
|---|---|---|
| `id` / `slug` | string | `liquid-brun`, used in `/scents/[slug]` |
| `house`, `name` | string | "French Avenue", "Liquid Brun" |
| `variant` | string? | "Original 100ml EDP" |
| `tier` | Tier | Drives price |
| `gender` | `him` \| `her` \| `unisex` | `leans` optional ("leans feminine") |
| `status` | `live` \| `coming_soon` \| `retired` | Live + no juice = "arriving soon" |
| `smellsLike` | `{ name, closeness? }[]` | Our opinion. Never implies it *is* the original |
| `notes` | `{ top, heart, base }` | |
| `vibes` | string[] | fresh, sweet, gourmand, oud, aquatic, fruity... |
| `occasions` | (`office` \| `lime` \| `fete` \| `date`)[] | |
| `ratings` | `{ heat, longevity, projection, compliments }` (1–5) | All `DRAFT` until rewritten |
| `take` | `{ by: "him" \| "her", text }` | `DRAFT` |
| `blurb` | string | `DRAFT` |
| `draft` | boolean | Shows a DRAFT badge on the page until the owner rewrites the copy |
| `fullBottle` | `{ price, depositPct: 50 }?` | Pre-order only, priced per product (later milestone) |

### Bottles (stock)

| Field | Type | Notes |
|---|---|---|
| `id` | string | Physical bottle ID written on the bottle, e.g., `LB-01` |
| `productId` | string | |
| `sizeMl` | number | 100 |
| `mlRemaining` | number | Updated after each decanting session |
| `costTtd` | number | Landed or replacement cost |
| `source` | string | Jomashop, local dealer, own shelf |
| `openedAt`, `isTester` | | |

**Availability** (pure function, `lib/stock.ts`): `available = Σ mlRemaining − ml reserved by orders not yet decanted (new, paid)`. A size can be sold while `available ≥ size`. Units left per size = `floor(available / size)`. A low-stock badge shows when units left ≤ 3 ("2 left in 10ml"). Nothing is faked.

### Settings and config

| Where | Field | Notes |
|---|---|---|
| Store (`Settings`) | `atomizers` | `{ 5: true, 10: true, 15: true }`. If 15 is off, 15ml still sells, labelled "ships as 10ml + 5ml" |
| Store (`Settings`) | `lowStockThreshold` | 3 |
| `web/src/config/site.ts` | `whatsappNumber` | +1 868-305-0506 (wa.me format `18683050506`) |
| `web/src/config/site.ts` | `pickupPoints` | Saturday run, customer picks one: Price Plaza, Chaguanas 10:00am · MovieTowne, Port of Spain 1:00pm · East Gates Mall 5:00pm |
| `web/src/config/site.ts` | `ownDropoffAreaIds` | **Placeholders** until the owner confirms the route |
| `web/.env.local` only | Bank accounts | A numbered list (`SMELLBESS_BANK_<n>_BANK / _ACCOUNT_NAME / _ACCOUNT_TYPE / _ACCOUNT_NUMBER`), read on the server at runtime. Never committed, never in seed data. `web/.env.example` has placeholders. On a host, set them as environment variables |

### Curated sets

`{ id, name, description, productIds: [3 ids], draft }`. Sold in two sizes: 3×5ml TT$150 or 3×10ml TT$280. Tier A products only.

### Offers (rules, config)

| Offer | Rule |
|---|---|
| `bundle_5x10` | 5 Tier A 10ml singles for TT$350 (applied once per order) |
| `set_3x5` / `set_3x10` | A curated set line at TT$150 / TT$280 |
| `free_5ml` | 3+ Tier A single decants of 10ml or 15ml → one free Tier A 5ml, customer picks, must be in stock |

**Exactly one offer per order.** The engine prices every eligible candidate, picks the one that saves the most, and explains it in plain words, including why another offer didn't apply. A+, D1, D2 and N are never part of an offer.

### Orders

| Field | Notes |
|---|---|
| `number` | `SB-1001`, sequential |
| `createdAt`, `status` | `new → paid → decanted → ready / out_for_delivery → done` (+ `cancelled`) |
| `customer` | name, phone (WhatsApp), optional note |
| `lines` | product, size, qty, unit price, set ref; frozen at order time |
| `offer` | the applied offer id, label, savings, free 5ml choice |
| `delivery` | method, area, zone, fee |
| `payment` | `bank_transfer` \| `cash_on_pickup` |
| `totals` | subtotal, discount, delivery, total |
| `utm` | source/medium/campaign captured from the landing URL |

### Delivery zones

| Method | Fee | Notes |
|---|---|---|
| `pickup` (Saturday) | 0 | Customer picks one of the pickup stops (location + time). Cash allowed |
| `workplace` | 0 | Owner's workplace hand-off |
| `own_dropoff` | 30 | Only in `ownDropoffAreas` |
| `odeliver` | by zone | Urban 30 / Rural 40 / Extended 50 / Remote 60 / Tobago 90 |

`areas: { name, zone }[]` is an editable list (seeded as a DRAFT; check it against ODeliver's own area list). Same-day (ODeliver Instant) is on request through WhatsApp, not priced on the site.

---

## 4. Pages and routes

| Route | What | Milestone |
|---|---|---|
| `/` | Home: hook line, how it works, featured scents, offers in plain words, delivery summary | M1 |
| `/scents` | Catalog: filter by gender, vibe, occasion and "smells like" | M1 |
| `/scents/[slug]` | Scent card: DNA, notes, ratings, his/her take, size picker with live stock, add to cart | M1 |
| `/sets` | Curated sets (3×5ml / 3×10ml) | M1 |
| `/cart` | Cart with the auto-picked offer explained, free 5ml picker | M1 |
| `/checkout` | Name, phone, delivery method and area, payment method, total before placing | M1 |
| `/order/[number]` | Confirmation: order number, bank transfer details, "Send order on WhatsApp" | M1 |
| `/delivery` | Delivery options and prices | M1 |
| `/admin` | Admin home (stub) | M2 |
| `/admin/orders` | Orders pipeline | M2 |
| `/admin/stock` | Products, bottles, ml remaining, atomizer flags | M2 |
| `/admin/decanting` | Today's decanting list grouped by scent and size | M2 |
| `/admin/zones` | Area → zone mapping | M2 |
| `/api/orders` (POST) | Server re-prices the cart and saves the order | M1 |
| `/api/admin/orders.csv` | CSV export | M2 |

---

## 5. Milestones

| # | Scope | Status |
|---|---|---|
| **M0** | This plan, scaffold, seed data, pricing/offers/stock/delivery engines with tests | This session |
| **M1** | Storefront: catalog, scent cards, sets, cart, checkout, confirmation with WhatsApp + bank transfer, delivery picker, legal footer, placeholder images | This session |
| **M2** | Admin: Supabase project, auth for 2 admins, orders pipeline, stock and bottles, atomizer flags, decanting list, zones editor, CSV export | Next. Routes and model stubbed now |
| **M3** | Launch polish: real photos, rewrite all DRAFT copy, OG images, schema.org `Product`/`Offer` in TTD, analytics with UTM, Lighthouse 95+ pass, domain + hosting | Before public launch |
| **M4** | Flex: "smells like" search, programmatic SEO pages, layering suggestions, reviews from the Day-7 message, authenticity page, full-bottle pre-orders with 50% deposit | After launch |

---

## 6. Open questions for the owner

*Answered (Oct 2026): WhatsApp number, bank accounts (kept in `.env.local` only), and the three Saturday pickup stops. The site asks customers to use the order number as the transfer reference.*

1. **Hosting:** Vercel Pro (US$20/mo) or a free commercial tier (Cloudflare or Netlify)? See §2.
2. **Bank accounts:** both are personal accounts today. Swap in a business account once the business name is registered? (Just edit the env vars.)
3. **Pickup stops:** are the Saturday times fixed every week, or do they change? They're edited in `web/src/config/site.ts`.
4. **Hosting the env vars:** whichever host is chosen, the bank details go in its environment-variable settings, not the repo.
5. **Own drop-off areas:** which areas or route do you cover at TT$30, and which evening? The current list (Port of Spain, Chaguanas, Arima) is a placeholder.
6. **Workplace hand-off:** show it publicly at all, or only to coworkers? Can workplace orders pay cash like pickup?
7. **Area → ODeliver zone list:** the seeded mapping is a DRAFT guess. Can you get ODeliver's official area list? And is Tobago TT$60 + TT$30 inter-island (we use TT$90)?
8. **Bundle more than once?** We apply the 5×10ml TT$350 bundle once per order ("exactly one offer"). Should 10×10ml get two bundles (TT$700)?
9. **Free 5ml qualifying decants:** we count only Tier A singles of 10ml+. Should A+ or designer 10ml decants also count toward the 3 (the free 5ml itself stays Tier A)?
10. **Curated sets:** which sets at launch, and which three scents in each? The seeded Fete Pack / Office Safe / Date Night / Her Gourmand picks are DRAFT.
11. **Designer decants from your own shelf** (2–4 scents, D1/D2): which ones, and how many ml are you willing to drain?
12. **Ratings and takes:** every rating and description is marked DRAFT. Who rewrites them, and by when?
13. **Photos:** when can you shoot the bottles on a consistent backdrop?
14. **Order notifications:** is the customer's WhatsApp message enough, or do you also want an email/Telegram ping to the admins when an order is saved?
