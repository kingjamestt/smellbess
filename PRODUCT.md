# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary (launch):** young Trini men, roughly 20–35, arriving on their phones from Instagram, TikTok and WhatsApp links, usually on mobile data. Many are new to niche and Arabian fragrances and are price-aware. They trust people more than websites. Their job: find a scent that actually performs, see the price, and order fast.
- **Secondary:** women (Hawas Diva, Yara, Angham) and gift buyers. The women's designer side grows later; launch is Arabian only (decants plus one sealed bottle per scent).
- **Admins (2):** the owner (men's side) and their girlfriend (women's side). They run stock, orders and decanting from their phones between other tasks. The owner also works full-time in IT.

## Product Purpose
Smell Bess sells fine fragrance in Trinidad & Tobago: hand-poured decants (5ml, 10ml, 15ml), one sealed full bottle per launch scent while it lasts, and other full bottles by pre-order (50% deposit). "Bess" is Trini slang for the best. The site should let a first-time visitor from Instagram trust the shop and send an order within two minutes. Success means orders that arrive on WhatsApp complete and correctly priced, and admin work that fits in a phone session.

## Positioning
- **Curation: only the best.** The shelf holds only strong performers, compliment-getters and proven best sellers. Nothing is filler, and played-out scents get retired (e.g. original Asad, original 9PM).
- **Smoothest ordering in T&T.** Clear tier prices, the best single offer applied and explained automatically, delivery cost shown before ordering, and a pre-filled WhatsApp hand-off. Competitors run on Take App, a basic Ecwid store and a weak WooCommerce site.

- **Try it, then own it.** The same scent as a decant and as a sealed bottle, side by side.

Prices match the market (KmG Scents, Fragrance Fanatics); the site never competes by undercutting.

## Operating Context
- Customers order on the site, then press "Send order on WhatsApp" (+1 868-305-0506). The owners reply there with bank details. **Bank details never appear on the site.**
- Payment is by bank transfer before dispatch. Cash is fine at pickup.
- Delivery (customer pays): a free Saturday pickup route (Price Plaza Chaguanas, MovieTowne POS, East Gates Mall; editable in admin) or ODeliver by zone (Urban 30, Rural 40, Extended 50, Remote 60, Tobago 90 TTD). Workplace hand-off is arranged on WhatsApp only and never shown on the public site. There is no own-drop-off option.
- Admin pipeline: new → paid → decanted → ready / out for delivery → done. Marking an order decanted deducts ml from the physical bottles. Admins also use a daily decanting list, stock, pickup and zone editors, and CSV export.
- Seasonal calendar: Christmas gifting, Carnival (8–9 Feb 2027), Valentine's.

## Capabilities and Constraints
- **Prices come from the tier, never per product (TTD):** A 60/100/150, A+ 70/120/175, D1 75/125/185, D2 120/200/275 (5/10/15ml). No 2ml and no 30ml.
- **Stock is real millilitres.** A size sells only while enough juice is left. The site never says how much is left (owner, 6 Oct 2026): a size is available or sold out, nothing in between. With 15ml atomizers off, a 15ml ships as 10ml + 5ml.
- **Sealed bottles are single items** with their own price (match the local market, e.g. Hawas Ice TT$550). When the sealed bottle sells, the scent becomes decants-only; out-of-stock bottles fall back to pre-order with a 50% deposit. Sealed bottles don't count toward any offer.
- **Exactly one offer per order**, chosen automatically and explained in plain words:
  - 5×10ml bundle at TT$350 per full group of 5 (Tier A only).
  - Curated sets at 3×5ml TT$150 or 3×10ml TT$280. The Fete Pack is TT$175 / TT$300.
  - Surprise free 5ml with 3+ single decants of 10ml or larger. The customer doesn't pick it; the cart shows a "you qualify" card with a small animation that respects reduced motion.
- **Never:** vouchers, quizzes, free delivery, card payments (v1).
- **Stack (existing):** Next.js 16 App Router, TypeScript, Tailwind 4, Vitest, Supabase (Postgres plus magic-link admin auth), deployed on Netlify free at smellbess.netlify.app. Node 24.
- **Performance:** mobile-first. LCP under 2s on 4G, Lighthouse 95+.
- **Undecided:** the smellbess.com domain isn't bought and the @smellbess handles aren't claimed. ODeliver's official area-to-zone list is unconfirmed.

## Brand Commitments
- **Name:** Smell Bess. **Handle:** `smellbess` (not yet claimed).
- **Look (locked 5 Oct 2026, `business-plan.md` §5a):** quiet luxury. Night #121014, Smoke #1E1B21, Pearl #EAE8E5, Ash #8F8A93, and Amber #E3A23B as the only accent. Archivo only: Expanded Light caps tracked 0.22em for display and the SMELL BESS wordmark (BESS in Amber, Amber rule, "FINE FRAGRANCE"), normal width for body. Monogram S|B and a thin-ring seal. Tagline: "Only the best." Brand pack: https://claude.ai/artifact/UofYt4NYKqVGszxNcpQXcw
- **Voice:** assured, discerning, warm and honest, quietly local. Calm statements, no exclamation marks or hype; at most one Trini touch per piece. The brand is the owners as enthusiasts telling people what works in TT heat ("don't blind buy this" still fits).
- **Scent cards:** "smells like" DNA, our ratings (TT heat, longevity, projection, compliments) and a his/her take. All drafted copy is marked DRAFT until the owners rewrite it.
- **Must not look like** a generic luxury template, gold foil, cream-and-serif "luxury", or AI-generated design.
- **Legal line** for the footer and product pages: "Decanted by hand from authentic bottles. Smell Bess is not affiliated with any brand. 'Smells like' comparisons are our opinion."
- Never imply a clone *is* the original. Never use designer trademarks as logos.
- **Brand product images** are downloaded and self-hosted, never hotlinked, and only show the product. They are never used as our branding. They get replaced by our own bottle shoots on a consistent backdrop.

## Evidence on Hand
- **Friends and coworker feedback:** informal reactions. Quote these only with the person's permission, and don't attribute them to anyone without it.
- **Own bottle photos** of the owner's shelf (e.g. Amber Oud Gold, Marwa). They are not yet in the repo.
- **Absent, so never fabricate:** customer reviews, order counts, testimonials, ratings from customers, press, unboxing videos and follower numbers.

## Product Principles
1. **Only fire on the shelf.** Every listed scent earns its place, and the site makes the curation feel deliberate rather than small.
2. **Two minutes from link to WhatsApp.** Every step that doesn't move an order forward is a cost.
3. **Honest numbers.** Real stock, real prices, delivery shown up front, one offer explained plainly, and no fake scarcity.
4. **People over platform.** The owners' voice and opinions carry trust. The site supports the WhatsApp relationship rather than replacing it.
5. **Phone on data first,** for customers and admins alike.

## Accessibility & Inclusion
WCAG 2.2 AA. Respect `prefers-reduced-motion`, including on the free-5ml animation. Dark mode is optional.
