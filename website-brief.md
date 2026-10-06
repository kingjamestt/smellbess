# Build prompt: smellbess.com

*Paste this into a new Claude Code session opened in `C:\_code\smell-good`. Read `CLAUDE.md` and `business-plan.md` first; they are the source of truth for prices, offers and delivery.*

---

You're building **smellbess.com**, the storefront for **Smell Bess**, a fine-fragrance business in Trinidad & Tobago selling **sealed full bottles and hand-poured decants**. "Bess" is Trini slang for the best. The shop carries only the best: proven performers and best sellers. The site has to be **the best fragrance shopping experience in T&T**. Local competitors run on Take App, a basic Ecwid store and a weak WooCommerce site. This site should make a first-time visitor from Instagram trust us and order within two minutes. It's also our main advantage over them.

Before writing code, read `CLAUDE.md` and `business-plan.md` (especially §2.3 pricing, §2.3a sizes, §2.3b offers, §4 positioning and §7.4 delivery). Then propose a short plan and the data model, and wait for my OK.

## Who uses it
- **Customers:** Trinis on their phones, arriving from IG, TikTok and WhatsApp links. They use mobile data, many are new to niche and Arabian fragrances, and they're price-aware. They trust people more than websites.
- **Admins (2):** the owner and their girlfriend. They update stock and orders from their phones, often between other tasks.

## What it must do (MVP, live in time for the public launch, ~3 weekends)

1. **Catalog.** Each scent gets a "scent card", not a generic product page:
   - Fields: house, name, tier (A / D1 / D2), for him / her / unisex, **"smells like" DNA** (e.g., "Creed Aventus DNA"), key notes, and occasions (office / lime / fete / date).
   - **Our ratings:** "TT heat" performance, longevity, projection and compliment rating.
   - **His / her take:** a short honest opinion from the person who wears it.
   - Filter by vibe, occasion, gender and DNA.
2. **Sizes and prices from tier, never hard-coded per product.**
   - Tier A: 5ml TT$60 · 10ml TT$100 · 15ml TT$150.
   - D1: 75 / 125 / 185. D2: 120 / 200 / 275. All prices in TTD.
   - **Sealed bottles:** each launch scent has one sealed bottle in stock, priced per product (e.g., Hawas Ice TT$499). It's a single item: shown as "1 left" until sold, then the scent is decants-only. Sealed bottles don't count toward the free 5ml or the bundle.
   - Full bottles not in stock are **pre-order**, priced per product, with a 50% deposit.
3. **Stock from real millilitres.** Each bottle has ml remaining.
   - A size is available only while there's enough juice left. Never show how much is left (owner, 6 Oct 2026); a size is available or sold out.
   - When the 15ml atomizer stock flag is off, the 15ml still sells but shows "ships as 10ml + 5ml".
4. **Offers engine.** Exactly **one offer per order**.
   - **5×10ml bundle for TT$350** (Tier A only). Each full group of 5 gets the bundle price, so 10×10ml is TT$700.
   - **Curated sets** (e.g., Fete Pack, Office Safe, Date Night, Her Gourmand): 3×5ml TT$150 or 3×10ml TT$280.
   - **Surprise free 5ml** with 3+ single decants of 10ml or larger, of any tier.
     - The customer does **not** pick it. The cart shows a "You qualify for a free 5ml surprise" card with a small animation that respects reduced motion.
     - We choose a Tier A 5ml when packing, usually a slow seller.
   - The cart applies the best offer automatically and explains it in plain words ("You've got 3×10ml, so a free 5ml surprise is going in your bag").
   - **No vouchers, no free delivery.**
5. **Checkout without online card payments (v1).**
   - Customer gives name, phone, delivery method and area.
   - The order is saved with an order number.
   - A confirmation screen shows a **"Send order on WhatsApp"** button that opens a pre-filled message to our number. **No bank details anywhere on the site.** We reply on WhatsApp with them.
   - Both admins get an email alert when an order is saved.
   - Pickup orders can pay cash.
   - Delivery orders are paid before dispatch.
6. **Delivery options with prices (customer always pays):**
   - Saturday pickup (free; show the location and time window). Stops and times can be edited in admin.
   - ODeliver by zone: Urban 30, Rural 40, Extended 50, Remote 60, Tobago 90 (60 + 30 inter-island).
   - **No own-drop-off option and no workplace hand-off on the public site.** The owner sometimes delivers in person but charges the ODeliver rate. Workplace orders come in on WhatsApp and are marked in admin.
   - Same-day delivery on request.
   - Area → zone mapping should be editable in admin.
7. **Admin (login for 2 people):**
   - Products and bottles (ml remaining, bottle ID, cost). Each bottle is either **open (decant stock)** or **sealed (for sale whole)**; marking a sealed bottle sold removes it from the shop.
   - **Orders pipeline:** new → paid → decanted → ready / out for delivery → done.
   - Atomizer stock flags.
   - A "today's decanting list" grouped by scent and size.
   - CSV export.
   - Must be mobile-first.

## The flex (after MVP, in this order)

**No quizzes, vouchers or other gimmicks.** Trini customers won't use them. Put the effort into browsing, search, scent cards and a fast checkout.

1. **"Smells like" search.** Type "Aventus", "Sauvage" or "Baccarat" and get our alternatives with an honest closeness rating and where they differ. This is our biggest SEO opportunity.
2. **Programmatic SEO pages:** "Best [designer] alternative in Trinidad", "Best fete fragrances in Trinidad" and similar. Add schema.org `Product`/`Offer` markup in TTD and per-scent Open Graph images, so links shared on WhatsApp/IG look sharp.
3. **Layering suggestions** on scent cards (e.g., "Liquid Brun + Vintage Radio").
4. **Reviews** collected from the Day-7 follow-up message, shown on scent cards.
5. **Authenticity page:** unboxing videos with invoices, batch-code checks, and how we decant (hygiene).

## Design direction
- **Mobile-first and very fast.** Target LCP under 2s on 4G and Lighthouse 95+. Most traffic is phones on data.
- **Quiet luxury, per the brand in `business-plan.md` §5a** (locked 5 Oct 2026): Night #121014 ground, Pearl #EAE8E5 text, Ash #8F8A93 quiet text, Amber #E3A23B as the only accent. Archivo only: Expanded Light caps for display and the SMELL BESS wordmark (tracked 0.22em, BESS in Amber, Amber rule, "FINE FRAGRANCE" descriptor), normal width for body. Voice: assured, discerning, warm, quietly local; no hype, no exclamation marks. It shouldn't look like a generic luxury template, gold foil, or cream-and-serif "luxury".
- **Product photos:** start with each brand's official product image, downloaded and hosted on our site (never hotlinked). Use them only to show the product, never as our branding or logo. Replace them with our own bottle shoots on a consistent backdrop once we have lighting.
- Meet WCAG AA. Dark mode is optional. Support reduced motion.

## Legal and copy rules
- Footer and product pages: "Decanted by hand from authentic bottles. Smell Bess is not affiliated with any brand. 'Smells like' comparisons are our opinion."
- Never imply a clone *is* the original. Never use designer trademarks as logos.
- Prices are in TTD and include nothing hidden. Delivery is shown before the order is placed.

## Tech constraints
- **Stack suggestion:** Next.js (App Router) + TypeScript + Tailwind, with Supabase (Postgres, auth for the 2 admins, storage for images). Deploy on Vercel or Cloudflare Pages. Use the Vercel/Supabase tools in this environment if they're connected.
- **Hosting cost:** keep it to ~US$0–20/month. Note that **Vercel's free Hobby plan doesn't allow commercial use.** Either budget for Vercel Pro (US$20/mo) or use Cloudflare Pages/Netlify, whose free tiers allow commercial sites. Supabase's free tier pauses after a week with no activity, so plan around that.
- **Domain:** `smellbess.com` from Namecheap (not bought yet). Point DNS to the host.
- **Analytics:** privacy-friendly (Vercel Analytics, Plausible or Cloudflare). Track UTM source (IG / TikTok / WhatsApp) per order.
- **Manageable by one person:** seed data from a single file or table, and no heavy CMS.
- **Ask me before** buying anything, creating paid cloud resources, or deploying to production.

## Launch data
- **Seed the catalog from `scent-lists.md`:** the launch buy is 7 scents, 2 bottles each (one sealed, one open), plus Amber Oud Gold and Marwa from the owner's shelf. Next-order scents can be listed as "coming soon" until their bottles arrive.
- **No designer decants at launch** (owner, 5 Oct 2026).
- Mark any rating or description you draft as `DRAFT`, so we can rewrite them in our own words.
