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
- **Offers (one per order, Tier A only):**
  - 5×10ml bundle: TT$350.
  - Curated sets: 3×5ml TT$150, 3×10ml TT$280.
  - Free 5ml (any in-stock Arabian) with 3+ single decants of 10ml or larger.
  - **No vouchers. No free delivery.**
- **Delivery (customer pays):**
  - Free: Saturday pickup route (Price Plaza Chaguanas 10am, MovieTowne POS 1pm, East Gates Mall 5pm) and workplace hand-off.
  - WhatsApp orders go to +1 868-305-0506. Bank transfer details live only in the site's `.env.local`; never commit them.
  - Own-vehicle drop-off along a route: TT$30.
  - ODeliver at cost: Urban 30 / Rural 40 / Extended 50 / Remote 60, Tobago 90.
  - Payment before dispatch by bank transfer; cash is fine at pickup.
- **Lineup:** see `scent-lists.md`.
  - **Bess List:** 20 approved scents. Must-haves: Liquid Brun, Hawas Ice, Hawas Diva, Angham, Supremacy Collector's Edition.
  - **Retired:** original Asad and original 9PM (played out).
  - **Launch buy (locked, 10 scents).** From Jomashop (order on or after 17 Oct): Liquid Brun (original EDP), Hawas Ice, Hawas Diva, Angham, Khamrah, Khamrah Qahwa, Yara (pink), Supremacy CE (A+). From the local Rayhaan dealer at TT$300 each: Rayhaan Aquatica, Rayhaan Elixir.
  - **Money:** card ≈ US$572 (TT$3,901), plus TT$600 cash for the Rayhaans.
  - **Women's side:** mostly designer decants (testers and the girlfriend's bottles), because Trini women prefer designers.
- **Card:** statement closes on the 16th, due on the 5th. Launch orders go in on or after 17 Oct 2026 and are due 5 Dec 2026.
- **No quizzes, no vouchers.** Trini customers don't use them.
- **Local source:** any Rayhaan for TT$300 from the local dealer, cheaper than importing.
- **Sourcing:** Jomashop/FragFlex → Websource Miami skybox → TT. Always declare full value. Jomashop orders over US$100 ship free.
- **Brand assets:** domain `smellbess.com` (available on Namecheap, not yet bought) and the `smellbess` handle on IG, TikTok, Facebook and WhatsApp (available, not yet claimed). Both as of Oct 2026.

## Competitors
- **KmG Scents** (take.app/kmgscents): Arabian decants at 5ml TT$60 / 10ml TT$100; only bundle is 5×10ml for TT$300.
- **Fragrance Fanatics** (fragrancefanaticstt.com): 10ml / 15ml / 30ml at TT$100 / 150 / 250; free delivery.
- **SA Exclusive** (saexclusivett.com): full bottles only.
