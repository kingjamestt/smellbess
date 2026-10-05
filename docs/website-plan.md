# Smell Bess website plan

*Written Oct 2026 for the `website-mvp` branch. Source of truth order: `CLAUDE.md` → `website-brief.md` → `scent-lists.md` → `business-plan.md`. Where `CLAUDE.md` and the brief differ, `CLAUDE.md` wins (e.g., Tier A+ and the launch lineup). Owner decisions from 5 Oct 2026 are in `business-plan.md` §5 "Website decisions".*

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

## 2. Hosting (decided 5 Oct 2026: Netlify free + Supabase free)

| Option | Monthly cost | Commercial use on free plan? | Next.js support | Notes |
|---|---|---|---|---|
| **Vercel Hobby** | US$0 | **No.** Hobby is for personal, non-commercial projects only | Best (Vercel makes Next.js) | Not allowed for a shop. Listed only to rule it out |
| **Vercel Pro** | **US$20 per member** (1 member is enough; the second admin doesn't need a Vercel seat, they log in to the site's own admin) | Yes | Best: zero config, image optimisation, analytics, preview deploys | Simplest. ~TT$136/month is roughly 2 orders' contribution |
| **Cloudflare (Workers/Pages + OpenNext adapter)** | US$0 | Yes | Good via `@opennextjs/cloudflare`; a few Next features need care (image optimisation goes through Cloudflare Images or is turned off) | Fastest edge network in the Caribbean, free analytics, free DNS. Slightly more setup |
| **Netlify Free** | US$0 | Yes | Good (Netlify's Next.js runtime is OpenNext-based) | Free plan is credit-based; check the current limits before choosing. Builds and bandwidth are plenty for this traffic |

**Decision:** **Netlify free** plus **Supabase free**. Keep the code host-neutral (it is), so moving to Vercel Pro later stays easy. *Verify the current plan terms on each provider's pricing page before signing up; they change.*

**Supabase free tier** pauses a project after ~7 days with no activity. Options: a daily scheduled ping (Cloudflare Cron Trigger, Netlify scheduled function or a GitHub Action), or Supabase Pro (US$25/mo) once orders are steady. Real orders every week will also keep it awake.

**Domain:** launch on the free **`smellbess.netlify.app`** address. Claim the `smellbess` site name when the Netlify site is created. `smellbess.com` (Namecheap, not bought) can be pointed at Netlify later. `web/.nvmrc` pins Node 24 for Netlify builds.

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
| Nowhere | Bank accounts | **Not on the site at all** (owner, 5 Oct 2026). The customer sends the order on WhatsApp and the owners reply there with payment details |

### Curated sets

`{ id, name, description, productIds: [3 ids], price?, draft }`. Sold as 3×5ml TT$150 or 3×10ml TT$280. Tier A only, unless the set sets its own `price`: the **Fete Pack** has Amber Oud Gold (A+) and costs TT$175 / TT$300. Launch sets (owner's picks and copy): Fete Pack, Date Night, Office/School Days, For Her.

### Offers (rules, config)

| Offer | Rule |
|---|---|
| `bundle_5x10` | Tier A 10ml singles: every full group of 5 is TT$350 (10×10ml = TT$700). Still counts as the one offer |
| `set` | Each curated set line at its set price (TT$150 / TT$280, Fete Pack TT$175 / TT$300) |
| `free_5ml` | 3+ single decants of 10ml or 15ml, **any tier** → one free 5ml **surprise**. The customer doesn't choose; the cart shows a "you qualify" card. The owners pick a Tier A 5ml when packing (often a slow seller). Only offered while some Tier A scent has 5ml to spare |

**Exactly one offer per order.** The engine prices every eligible candidate, picks the one that saves the most, and explains it in plain words, including why another offer didn't apply. Only Tier A fills a bundle; any tier counts toward the free 5ml.

### Orders

| Field | Notes |
|---|---|
| `number` | `SB-1001`, sequential |
| `createdAt`, `status` | `new → paid → decanted → ready / out_for_delivery → done` (+ `cancelled`) |
| `customer` | name, phone (WhatsApp), optional note |
| `lines` | product, size, qty, unit price, set ref; frozen at order time |
| `offer` | the applied offer id, label, savings. A free 5ml is a `free` line with no `productId` until an admin picks the scent |
| `delivery` | method, area, zone, fee |
| `payment` | `bank_transfer` \| `cash_on_pickup` |
| `totals` | subtotal, discount, delivery, total |
| `utm` | source/medium/campaign captured from the landing URL |

### Delivery zones

| Method | Fee | Notes |
|---|---|---|
| `pickup` (Saturday) | 0 | Customer picks one of the pickup stops (location + time). Cash allowed |
| `workplace` | 0 | **Admin only.** Coworkers order on WhatsApp; never shown at the public checkout. Cash allowed |
| `odeliver` | by zone | Urban 30 / Rural 40 / Extended 50 / Remote 60 / Tobago 90 (60 + 30 inter-island). When the owner passes by and delivers in person, the price is the same |

There is **no own-drop-off option** (owner, 5 Oct 2026).

`areas: { name, zone }[]` is an editable list (seeded as a DRAFT; check it against ODeliver's own area list). Same-day (ODeliver Instant) is on request through WhatsApp, not priced on the site.

---

## 4. Pages and routes

| Route | What | Milestone |
|---|---|---|
| `/` | Home: hook line, how it works, featured scents, offers in plain words, delivery summary | M1 |
| `/scents` | Catalog: filter by gender, vibe, occasion and "smells like" | M1 |
| `/scents/[slug]` | Scent card: DNA, notes, ratings, his/her take, size picker with live stock, add to cart | M1 |
| `/sets` | Curated sets (3×5ml / 3×10ml) | M1 |
| `/cart` | Cart with the auto-picked offer explained, free 5ml surprise card | M1 |
| `/checkout` | Name, phone, delivery method and area, payment method, total before placing | M1 |
| `/order/[number]` | Confirmation: order number, "Send order on WhatsApp" (payment details come back on WhatsApp) | M1 |
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
| **M1** | Storefront: catalog, scent cards, sets, cart, checkout, confirmation with WhatsApp, delivery picker, legal footer, placeholder images | Done. Updated 5 Oct 2026 for the owner's decisions |
| **M2** | Admin: Supabase project, magic-link login for the 2 admins, orders pipeline (decanting deducts bottles), free 5ml picks, stock and bottles, atomizer flags, decanting list, zones editor, pickup stops editor, workplace/WhatsApp orders, email alerts (Resend), CSV export | **Done 5 Oct 2026.** Needs the owner's secret key, admin emails and (optionally) a Resend key in env vars |
| **M3** | Launch polish: brand product images (self-hosted, never hotlinked), Claude-drafted copy edited by the owners, OG images, schema.org `Product`/`Offer` in TTD, analytics with UTM, Lighthouse 95+ pass, Netlify deploy on smellbess.netlify.app | Before public launch |
| **M4** | Flex: "smells like" search, programmatic SEO pages, layering suggestions, reviews from the Day-7 message, authenticity page, full-bottle pre-orders with 50% deposit | After launch |

---

## 6. Owner decisions and open questions

*Answered 5 Oct 2026 (details in `business-plan.md` §5):*
- **Hosting:** Netlify free + Supabase free, on smellbess.netlify.app.
- **Bank details:** never on the site; sent on WhatsApp. Personal accounts for now.
- **Order alerts:** email both admins.
- **Pickup stops:** editable in admin (M2).
- **Delivery:** no own-drop-off option. Workplace hand-off is admin-only. Tobago is TT$90.
- **Offers:** the bundle repeats per 5. The free 5ml is a surprise; any tier counts toward the 3.
- **Sets:** the owner's 4 picks and copy.
- **Lineup:** Arabians only at launch, no designers. Amber Oud Gold and Marwa come from the owner's shelf.
- **Copy:** Claude drafts it, the owners edit. **Photos:** brand images first, own shoots later.

*Still open:*
1. **Area → ODeliver zone list:** the seeded mapping is a DRAFT guess. Can you get ODeliver's official area list?
2. **Ratings and takes:** when will the owners review the drafted copy?
