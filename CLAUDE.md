# Smell Bess: project context for agents

**Smell Bess** is a side business in Trinidad & Tobago selling fragrance decants and full-bottle pre-orders. "Bess" is Trini slang for the best. The business only carries "fire" scents (strong performers and compliment-getters) and proven best sellers. It's run by the owner, who works full-time in IT and covers men's fragrances, and their girlfriend, who covers women's.

## Files
| File | What it is |
|---|---|
| `business-plan.md` | **Source of truth** for every business decision: pricing, offers, lineup, delivery, cash flow, checklist |
| `business-plan.html` | Shareable page built from the plan. Published at https://claude.ai/artifact/9SzQ8nCgufqyQATZJtx4qe. Republish this same file to keep the URL |
| `landed_cost.py` | Landed-cost calculator (Websource → TT, full-value declaration, 7% Miami sales tax on Jomashop) |
| `scent-lists.md` | Bess List (approved), to-decide, retired and research lists, with competitor signals |
| `website-brief.md` | Build prompt for the smellbess.com website |
| `tools/build_page.py` | Rebuilds `business-plan.html` from the .md (`pip install markdown`). Styling lives in `tools/page-template.html` |

When a decision changes, update `business-plan.md` first, run `python tools/build_page.py`, and republish `business-plan.html` to the same artifact URL.

## Locked decisions (Oct 2026)
- **Model:** decants first. Full bottles only by pre-order with a 50% deposit.
- **Sizes:** 5ml, 10ml and 15ml only. **No 2ml, no 30ml.** If 15ml atomizers run out, send a 10ml + 5ml at the 15ml price.
- **Prices (TTD):**

  | Tier | 5ml | 10ml | 15ml |
  |---|---|---|---|
  | A: Arabian/clone (Jomashop ≤ US$40) | 60 | 100 | 150 |
  | A+: premium Arabian (Jomashop > US$40; not in bundle or free 5ml) | 70 | 120 | 175 |
  | D1: mainstream designer | 75 | 125 | 185 |
  | D2: premium designer | 120 | 200 | 275 |

  Match market prices; don't undercut.
- **Offers (one per order):**
  - 5×10ml bundle (Tier A): TT$350 per full group of 5, so 10×10ml is TT$700.
  - Curated sets: 3×5ml TT$150, 3×10ml TT$280, Tier A only. The **Fete Pack** is the exception: it has one A+ scent and costs TT$175 / TT$300. The 4 launch sets and their copy are in `business-plan.md` §2.3b.
  - **Surprise free 5ml** with 3+ single decants of 10ml or larger, of any tier. The customer doesn't choose; we pick a Tier A 5ml when packing, to move slow sellers. The site shows a "you qualify" card with an animation.
  - **No vouchers. No free delivery.**
- **Delivery (customer pays):**
  - Free: Saturday pickup route (Price Plaza Chaguanas 10am, MovieTowne POS 1pm, East Gates Mall 5pm; editable in admin) and workplace hand-off (WhatsApp only, never on the public site).
  - WhatsApp orders go to +1 868-305-0506. **Bank details are never on the website**; the owners send them on WhatsApp.
  - **No own-drop-off option.** Customers pay the ODeliver rate. The owner delivers in person when passing (public spots and businesses only) and keeps the fee.
  - ODeliver at cost: Urban 30 / Rural 40 / Extended 50 / Remote 60. Tobago 90 (60 + 30 inter-island, confirmed).
  - Payment before dispatch by bank transfer; cash is fine at pickup.
- **Lineup:** see `scent-lists.md`.
  - **Bess List:** 20 approved scents. Must-haves: Liquid Brun, Hawas Ice, Hawas Diva, Angham, Supremacy Collector's Edition.
  - **Retired:** original Asad and original 9PM (played out).
  - **Launch buy (locked, 11 scents).**
    - From Jomashop (order on or after 17 Oct): Liquid Brun (original EDP), Hawas Ice, Hawas Diva, Angham, Khamrah, Khamrah Qahwa, Yara (pink), Supremacy CE (A+), Asad Bourbon.
    - From the local Rayhaan dealer at TT$300 each: Rayhaan Aquatica, Rayhaan Elixir.
  - **From the owner's shelf (no purchase):** Amber Oud Gold Edition (~50ml, A+) and Marwa (~80ml, Tier A).
  - **Money:** card ≈ US$624 (TT$4,254), about US$24 over the US$600 ceiling, plus TT$600 cash for the Rayhaans.
  - **Women's side:** mostly designer decants (testers and the girlfriend's bottles), because Trini women prefer designers.
- **Card:** statement closes on the 16th, due on the 5th. Launch orders go in on or after 17 Oct 2026 and are due 5 Dec 2026.
- **No quizzes, no vouchers.** Trini customers don't use them.
- **Local source:** any Rayhaan for TT$300 from the local dealer, cheaper than importing.
- **Sourcing:** Jomashop/FragFlex → Websource Miami skybox → TT. Always declare full value. Jomashop orders over US$100 ship free.
- **Brand assets:** domain `smellbess.com` (available on Namecheap, not yet bought) and the `smellbess` handle on IG, TikTok, Facebook and WhatsApp (available, not yet claimed). Both as of Oct 2026.

## Current status (5 Oct 2026)
- **Plan:** complete, with the checklist tracked in `business-plan.md` §11. Items 1–4 and 11 are done. Item 5 (launch order) is locked but not placed; order on or after 17 Oct.
- **Repo:** github.com/kingjamestt/smellbess. `main` holds the plan files and is pushed.
- **Website:** on branch **`website-mvp`** (pushed), in `web/`. M0, M1 and M2 are done.
  - Built with Next.js 16, TypeScript, Tailwind 4 and Vitest. 142 tests pass; lint and build are clean.
  - Use Node 24 (`web/.nvmrc`). The shell defaults to Node 20.8, which breaks Vitest, so prefix with `PATH=~/.nvm/versions/node/v24.19.0/bin:$PATH`.
  - Read `docs/website-plan.md` and `web/README.md` on that branch first.
  - **Supabase:** project `smellbess`, ref `kdchdpgxgflysuzqodzu`, in org "BS Web" (us-east-1, free plan).
    - Seeded with the catalog, 4 sets, areas, settings and the 2 shelf bottles. No orders, no auth users.
    - RLS is on with no policies, so only the server touches data, using the secret key.
    - Migrations are in `web/supabase/migrations`. Seed with `web/scripts/seed-sql.mts`.
  - **Admin (`/admin`):** magic-link login for the emails in `SMELLBESS_ADMIN_EMAILS`.
    - Orders pipeline (marking decanted deducts bottle ml), free 5ml picker, new WhatsApp/workplace orders.
    - Decanting list, stock, pickup editor, zone editor, CSV export.
    - Resend email alerts.
  - **Owner to-dos before admin works for real:**
    - Paste the Supabase secret key into `web/.env.local`.
    - Set `SMELLBESS_ADMIN_EMAILS` (both admins' emails).
    - Optionally add a Resend API key.
- **Next: M3 launch.**
  - Deploy to Netlify on smellbess.netlify.app and set its env vars.
  - Add `https://smellbess.netlify.app/**` to Supabase Auth → URL configuration (redirect URLs), and set the Site URL.
  - Add self-hosted brand product images.
  - Owners edit the drafted copy.
  - Add launch bottles in admin when they arrive (week 3).
- **Decisions from 5 Oct 2026** are in `business-plan.md` §5 "Website decisions".
- **Still open:**
  - @smellbess handles are not claimed yet.
  - The `smellbess` Netlify site name: the owner claims it when they create the Netlify site.
  - ODeliver's official area list (the seeded area → zone map is a guess).

## Competitors
- **KmG Scents** (take.app/kmgscents): Arabian decants at 5ml TT$60 / 10ml TT$100; only bundle is 5×10ml for TT$300.
- **Fragrance Fanatics** (fragrancefanaticstt.com): 10ml / 15ml / 30ml at TT$100 / 150 / 250; free delivery.
- **SA Exclusive** (saexclusivett.com): full bottles only.
