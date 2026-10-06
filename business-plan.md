# Smell Bess: Business Plan

**Smell Bess** sells only the best: proven best sellers and scents that perform and get compliments, as full bottles and hand-poured decants. If it isn't bess, we don't carry it. Tagline: *Only the best.* Website: smellbess.com · Handle: @smellbess

*Prepared 5 Oct 2026; updated the same evening for **full bottles at launch** (§1, §3.1) and the **luxury rebrand** (§5a). **Sealed bottle prices reset to the local market on 6 Oct 2026** (§2.4a); cash flow and projection redone. FX: 6.82 TTD/USD. All landed costs assume **full-value declaration with invoices**, at the rates on a real Websource invoice (§2.1, recalibrated 6 Oct 2026). The numbers come from [landed_cost.py](landed_cost.py), so you can rerun them when prices change.*

**Labels used:** ✅ verified online (source linked at the end) · ⚠️ estimate or unverified, so confirm before relying on it.

---

## 0. Assumptions (correct me if any are wrong)

These didn't block the plan, but each one changes the numbers:

1. ☑ **Card cycle (confirmed):** the statement closes on the **16th** and payment is due on the **5th** of the following month (minimum payment 1/30 of the balance). Ordering on **Sat 17 Oct** puts every launch charge on the 16 Nov statement, **due Sat 5 Dec**: 49 days, or 7 weeks. Pay it in full; the 1/30 minimum just starts interest.
2. **Your own collection:** you're willing to decant 2–4 of your own bottles for launch (e.g., a Sauvage/Eros/Le Male type). That gets you to 10–12 scents without extra spending.
3. ☑ **Location:** you have your own vehicle and run a **Saturday pickup route: Price Plaza Chaguanas 10am → MovieTowne Port of Spain 1pm → East Gates Mall 5pm**. Tobago orders go by ODeliver or TTPost.
4. ☑ **Websource flies perfume (confirmed):** you've flown several perfumes with them, and you know local fragrance sellers who use them.

---

## 1. Business model: bottles to break in, decants to earn

**Decision (owner, 5 Oct 2026): launch with full bottles *and* decants.** Buy **2 bottles of each Jomashop scent**: one stays sealed and boxed for sale as a full bottle, the other is decanted. **When the sealed bottle sells, that scent goes decants-only** (the KmG model). Full bottles of anything not in stock stay **pre-order with a 50% deposit**.

Why bottles at launch, even though they earn far less per ml:
- **Cash comes back fast.** One bottle sale is one conversation and five minutes, versus 5–8 decant orders. That matters with the card due 5 Dec.
- **Christmas.** Full bottles are the easy gift and sell quickly from mid-November. Launching in week 3 (early Nov) catches that.
- **Breaking in.** A new shop with bottles in stock reads as serious; decants alone read as a side hustle. The bottle buyers then come back for decants.

The trade-off, per bottle (Hawas Ice, landed TT$295, sealed price TT$499):

| | Sold sealed | Decanted |
|---|---|---|
| Revenue | TT$499 | ~TT$1,000 |
| Gross profit | ~TT$204 (41%) | ~TT$590 (59%) |
| Orders / time | 1 order, 5 min | ~5–8 orders, ~60 min |

On the launch lineup, the 7 sealed bottles bring ~TT$3,400 for ~TT$815 profit (§2.4a). Decanting them instead would earn ~TT$3,900 more over time. **Bottles are a cash-flow and launch tool, not the profit engine.** The rule "one sealed bottle per scent, then decants only" keeps that trade small.

Why decants stay the core (the original analysis still holds):

| Same bottle (Lattafa Khamrah, landed TT$359) | Sold as a full bottle | Decanted (7×10ml + 5×5ml) |
|---|---|---|
| Revenue | ~TT$450 (local market price ⚠️) | TT$1,000 (at TT$100 / 60) |
| Cost (bottle + supplies) | TT$359 | TT$469 |
| **Gross profit** | **TT$91 (20%)** | **TT$531 (53%)** |
| Orders needed | 1 | ~5–8 |
| Your time | 5 min | ~60 min |

At full-value declaration, **most full bottles are nearly unprofitable against local competition.** Landed Armaf CDNIM costs ~TT$470 and SA Exclusive sells it for TT$525. KmG sells Hawas Diva for TT$450, Vintage Radio for TT$499 and Dylan Blue for TT$625, all at or below what those bottles would cost you landed. Competitors are probably buying wholesale or under-declaring. **The exception is a Jomashop sale plus a stacked coupon.** With EXTRA20 + EXTRA10 on the launch cart, Hawas Ice is US$24.98 and lands at ~TT$295, while KmG charges TT$599.99 and is sold out. Sales like that are when sealed bottles make sense, so watch for them.

### Phases and triggers

| Phase | When | Model | Move to the next phase when ALL of these are true |
|---|---|---|---|
| **1. Prove it** | Months 0–3 (Nov–Jan) | Decants (5/10/15ml), curated sets, the 5×10ml bundle, **one sealed bottle per launch scent** (then decants only), other full bottles **pre-order only** (50% deposit, shipped in the weekly consolidated order) | Card repaid · ≥40 orders/month for 2 consecutive months · ≥25% repeat customers · ≥TT$3,000 retained profit |
| **2. Hybrid** | Months 4–8 (Feb–Jun) | Restock sealed bottles only where landed + 20% ≤ local price (usually a Jomashop sale + coupon), own website, gift sets, monthly "drops". Repeat the "2 bottles, sell 1 sealed" buy before peaks (Valentine's, Mother's and Father's Day, Christmas) | ≥TT$8,000/month revenue for 2 months · each sealed bottle sells through in ≤6 weeks · cash ≥ 2 months of inventory purchases |
| **3. Scale** | Month 9+ (Jul–) | Wholesale sourcing (US distributors / Lattafa-USA wholesale / regional), commercial import through a broker, larger lineup, pop-ups. Consider a company and VAT advice | Revisit when you approach the TT$600k VAT threshold or want to quit decanting by hand |

**What would make me change this:** if a cheaper full-bottle source turns up (wholesale with proper commercial clearance), sealed bottles become a profit line, not just a cash-flow tool.

---

## 2. Unit economics

### 2.1 Landed cost (full value declared; recalibrated 6 Oct 2026)

**Calibrated to a real Websource invoice** (6 Aug 2026, a Fashion Nova order, 10 lb, TT$562.75), which [landed_cost.py](landed_cost.py) now reproduces to the cent. The earlier version used Websource's published quote and **overstated fees by about 2×**.

`Freight US$3.26/lb (billed per whole lb) · fuel 17% of freight · insurance US$1 per shipment · CIF = declared value + freight · duty 20% · OPT 7% · VAT 12.5% × (CIF + duty + OPT)`

| | Websource quote (old model) | Real invoice (new model) |
|---|---|---|
| Freight | US$4.97/lb | **US$3.26/lb** |
| Fuel | US$0.84/lb | **17% of freight** (~US$0.55/lb) |
| Insurance | US$1.00 **per lb** | **US$1.00 per shipment** |

| Jomashop price, one 1 lb bottle shipped alone (incl. 7% tax) | Fees (USD) | Landed (USD) | **Landed (TTD)** | Cost/ml (95 usable) |
|---|---|---|---|---|
| $25 | $17.77 | $44.52 | **TT$304** | TT$3.20 |
| $35 | $22.36 | $59.81 | **TT$408** | TT$4.29 |
| $50 | $29.24 | $82.74 | **TT$564** | TT$5.94 |
| $80 | $43.00 | $128.60 | **TT$877** | TT$9.23 |

**Rule of thumb: landed USD ≈ 1.43 × the price with tax + ~US$5.20 per lb + US$1 per shipment.** Taxes take 42.9% of value whatever you do; the per-lb part is where weight and consolidation matter. The launch cart's bottles land ~8% below the old model's figures.

⚠️ **The invoice was under-declared.** The order cost US$199.97, but customs taxed only ~US$101 (CIF TT$688.40). That gap, not cheaper rates alone, is why past shipments felt ~TT$50/bottle cheaper than quotes. **This plan still assumes full-value declaration**: perfume bought in pairs looks commercial, an under-declared shipment can be reassessed with penalties, and the Jomashop invoice goes to Websource anyway (§3.4). At full value, that same Fashion Nova order would have cost **~TT$850–950** in fees. If Websource keeps taxing below the invoice, treat it as upside, not as the plan.

*Still unconfirmed: whether customs adds freight to the taxed value. The model assumes it does (the dearer reading); if not, bottles land another ~TT$10–15 cheaper.*

**Does consolidating help?** Only a little. Duty, OPT and VAT (42.9% of value) are the same whether you ship one bottle or ten. Consolidation saves the US$1 insurance per shipment and the **weight rounding**: three 1.4 lb bottles shipped separately are billed at 2 lb each (6 lb), while together they're billed at 5 lb. Worth doing: run one consolidated shipment per week or fortnight. Ask Websource to remove outer cartons only on bottles you'll decant. Keep boxes on anything sold sealed.

**Jomashop costs, as you confirmed:**
- **Sales tax: ~7% (Miami-Dade rate)**, because the skybox has a Miami address. This is now included in every number in this plan. I also assumed Websource declares the **invoice total including tax** to customs, which is the conservative assumption ⚠️. If they declare the pre-tax price, your costs are slightly lower.
- **Shipping: US$5.99 on orders under US$100 (and the 7% tax applies to shipping too), free over US$100.** Always batch Jomashop orders to at least US$100. A lone US$35 Hawas Diva costs US$43.86 at checkout before Websource.

**Other hidden costs:**
- ⚠️ Your bank's card FX rate is probably 6.85–6.95, not 6.82, plus any foreign-transaction fee.
- ⚠️ Possible hazmat/perfume surcharge (see §3.4).

### 2.2 Decant supply costs ⚠️ (Amazon bulk prices landed through Websource, rounded up)

| Size | Atomizer/vial | Label | Packaging (bag, card, bubble) | Tools/alcohol (amortized) | **Total supplies per unit** |
|---|---|---|---|---|---|
| 5ml glass atomizer | TT$5.00 | 0.50 | 2.00 | 0.50 | **TT$8** |
| 10ml glass atomizer | TT$6.50 | 0.50 | 2.50 | 0.50 | **TT$10** |
| 15ml glass atomizer | TT$8.00 | 0.50 | 3.00 | 0.50 | **TT$12** ⚠️ |

Use **glass, screw-top or crimp-free atomizers with good pumps** (not plastic). Cheap leaky atomizers kill repeat business.

**No sizes under 5ml.** A 2ml earns a few dollars, takes the same time to fill and label as a 10ml, and customers don't value it. The 5ml is the trial size, and the 10ml is the main product.

### 2.3 Pricing ladder (updated with competitor prices)

**What your screenshots show:** both KmG and Fragrance Fanatics price **every Arabian/clone decant the same**, at 5ml TT$60 / 10ml TT$100. That holds for Khamrah, Hawas Ice, Hawas Diva, Vintage Radio, 9PM Night Out, Liquid Brun, Amber Oud Aqua Dubai, Musamam and Marwa. The local market has settled on **TT$10–12/ml** for Arabians, and customers have learned those numbers. Designers are priced per scent (Dylan Blue 10ml TT$120, Born in Roma Intense 10ml TT$200 at both shops).

**Decision: match the market price, don't undercut it.** Charging TT$55/95 instead of TT$60/100 wouldn't win you customers. It would only cost you about 8% of your margin and invite a price war. Win on the things they don't offer:
- **Curated sets** that solve "what should I try?"
- **A surprise free 5ml with 3+ decants of 10ml or larger.**
- **A 15ml size** at FF's price. KmG only offers 5ml and 10ml.
- **Reliable stock.**
- **Better guidance** on what to buy.

| Tier | Cost/ml | 5ml (events, trial) | 10ml (main) | 15ml (regulars) | Full bottle |
|---|---|---|---|---|---|
| **A. Arabian/clone** (Lattafa, Armaf, Afnan, Rasasi, Alhambra, French Avenue) | TT$3–5.5 | **TT$60** | **TT$100** | **TT$150** | **Sealed bottle at the local market price** (one per launch scent, §2.4a); otherwise pre-order |
| **A+. Premium Arabian** (Jomashop **over US$40**, e.g., Musamam Black Intense, Supremacy CE, 9PM Night Out, Yara Elixir, Atheeri, Amber Oud Gold) | TT$5–7 | **TT$70** | **TT$120** | **TT$175** | Sealed bottle at market price, or pre-order. **Not in the 5×10ml bundle and never given as the free 5ml** (A+ 10ml decants do count toward qualifying for it) |
| **D1. Mainstream designer** (Eros, Dylan Blue, Sauvage EDT, Bleu de Chanel EDT) | TT$7–8 | **TT$75** | **TT$125** | **TT$185** | Pre-order only |
| **D2. Premium designer / flankers** (Born in Roma Intense, Le Male Elixir, Stronger With You Intense) | TT$9–13 | **TT$120** | **TT$200** | **TT$275** (FF's price) | Pre-order only |
| **N. Niche** (Jo Milano etc.; KmG charges 5ml TT$100 / 10ml TT$180) | TT$15+ | cost/ml × 2 + supplies, rounded up | | | Pre-order only |

**Price rule (owner's call):** if a 100ml Arabian costs **over US$40 on Jomashop, it's Tier A+** (TT$70 / 120 / 175). The price goes up to suit; we don't skip the scent. That holds even where KmG sells the same scent at TT$60/100 (e.g., 9PM Night Out). At US$40 and under, it stays Tier A. A+ margins on the current picks are 35–52% on a 10ml. **Testers** (same juice, no box) are often 20–30% cheaper and ideal for decant stock. Full table in `scent-lists.md`.

**Women's side:** Trini women mostly buy **designers** (Ariana Grande, Valentino, Versace), so the women's range is mainly D1/D2 designer decants. These come from Jomashop testers and the girlfriend's own bottles, plus Christmas-gift pre-orders. Keep 2–3 women's Arabians for budget buyers. KmG sells celebrity designers like AG Cloud at TT$60/100, which is below our landed cost, so pick designers KmG doesn't carry.

### 2.3a Three sizes: 5ml, 10ml, 15ml

| Size | Who it's for | Per ml (Tier A) | Margin, launch lineup |
|---|---|---|---|
| **5ml, TT$60** | Budget buyers who want something for a few events or fetes, and people trying a scent. It's also used in the 5ml curated sets (e.g., a Fete Pack of 3×5ml) and in the free 5ml | TT$12.00 | 52–61% |
| **10ml, TT$100** | The core size, and the one used in the 5×10ml bundle. KmG and FF both anchor here | TT$10.00 | 48–59% |
| **15ml, TT$150** | **Regulars.** FF's 15ml is often the size that's sold out (Marwa, Musamam), which suggests it sells best. It lasts about 2 months of daily wear. The price per ml is the same as a 10ml, so you earn 50% more per order for the same fill-and-label time | TT$10.00 | 50–61% |

**No 30ml.** At TT$250 it sits too close to a full bottle (Pride Nebras TT$425, Hawas Ice TT$499), and it ties up 30% of a bottle in one sale. Customers who want that much should buy the sealed bottle or pre-order one.

**If you run out of 15ml atomizers,** tell the customer and send **a 10ml + a 5ml** at the same TT$150. It's the same 15ml of juice, and most people will be fine with it. It costs you ~TT$6 more in supplies (margin drops ~4 points), so treat it as a fallback and reorder 15ml atomizers when you're down to ~5.

### 2.3b Offers (one offer per order)

*Bundle and sets: Tier A only. Free 5ml: any tier's 10ml+ decants qualify, but the free 5ml itself is always a Tier A scent that we choose.*

KmG dropped its 3×5ml and 5×5ml bundles. **Its only bundle is now any 5 Arabian 10ml decants for TT$300**, which works out to TT$60 per 10ml. Your cost on the Tier A launch lineup is TT$41–54 per 10ml (TT$46 on average):

| Offer | Customer pays | Your cost | Gross profit | Margin |
|---|---|---|---|---|
| 5×10ml at **TT$300** (matching KmG) | 300 | ~230 | ~70 | **23%** (10% if they pick the 5 dearest) |
| **5×10ml at TT$350 (recommended)** | 350 | ~230 | **~120** | **34%** (23% worst case) |
| **3×10ml + free 5ml** (our pick, Tier A) | 300 | ~164 | **~136** | **45%** |
| 3×15ml + free 5ml | 450 | ~224 | ~226 | 50% |
| 3×10ml, no offer (for comparison) | 300 | ~138 | ~162 | 54% |
| **Curated set: 3×5ml in a gift box** | **150** | ~83 | ~67 | 45% |
| **Curated set: 3×10ml in a gift box** | **280** | ~143 | ~137 | 49% |

*A sealed full bottle is its own order line. It doesn't count toward the free 5ml or the bundle, and it can sit in the same order as one decant offer.*

**Recommendations:**
- **5×10ml for TT$350: yes.** Matching TT$300 would leave you ~TT$13 per decant. That's a price war KmG can afford (his costs are probably lower than yours) and you can't. At TT$350 you're still TT$150 cheaper than buying the five separately, which is a strong deal. Sell it on stock and curation ("5 that actually perform in TT heat"), not on price. Some bargain hunters will still choose KmG, and that's fine.
- **5×10ml bundle, more than once:** each full group of 5 Tier A 10ml decants gets TT$350, so 10×10ml is TT$700. It still counts as the order's one offer.
- **Free 5ml with 3+ decants of 10ml or larger: yes, as a surprise (owner's call, 5 Oct 2026).**
  - Any tier counts toward the 3 (Tier A, A+, D1 and D2 singles).
  - **The customer doesn't choose the scent.** The site shows a "You qualify for a free 5ml surprise" card, and **we pick a Tier A 5ml when packing**. Use it to move slow sellers and seed the next sale.
  - It costs you ~TT$27 and keeps ~44–48% margin on a Tier A order (more on A+ and designer orders).
- **The offers don't stack.** Five 10ml decants means the TT$350 bundle *or* five singles with the free 5ml, not both. The bundle is the better deal, so most people will pick it.
- **No free delivery at this stage.** The customer always pays delivery, at cost (§7.4), so offers are the only discount you give.
- **Curated sets** are the guided way to buy, for example a "Fete Pack", "Office Safe Pack", "Date Night Pack" or "Her Gourmand Pack". Each set comes in two sizes, both with a gift box and scent cards:
  - **3×5ml for TT$150** (TT$180 bought separately, ~17% off). A trial or a few events.
  - **3×10ml for TT$280** (TT$300 bought separately, ~7% off). For people who already like the style.

  **Launch sets (owner's picks, 5 Oct 2026; scents re-mapped to the new cart, owners to confirm ⚠️):**

  The final cart dropped Khamrah, Khamrah Qahwa, Yara, Asad Bourbon and Rayhaan Elixir, so three sets lost scents. The names and copy are the owner's. The swaps below are **drafts** to confirm by smell before the sets go on sale.

  | Set | Scents | Price 3×5ml / 3×10ml | Copy |
  |---|---|---|---|
  | **Fete Pack** (men) | Hawas Ice, Rayhaan Aquatica ⚠️ *(was Rayhaan Elixir)*, Amber Oud Gold Edition (A+) | **TT$175 / TT$300** (higher because of the A+ scent) | "If you want to be the star of the show, turn heads when you pass, and get stopped randomly, this selection here is for you." |
  | **Date Night** (men) | Liquid Brun, Pride Nebras ⚠️, Musamam Black Intense (A+) ⚠️ *(were Khamrah Qahwa, Asad Bourbon)* | **TT$175 / TT$300** (now has an A+ scent) | "Warning! Now listen fellas, ladies will want to be all up in your space with this pack here. You will smell better than the dessert menu." |
  | **Office/School Days** (men) | Rayhaan Aquatica, Hawas Ice, Marwa ⚠️ *(was Khamrah)* | TT$150 / TT$280 | "Smell the bess at the office or school, make a statement without saying a word. Go light on sprays: 2–4 max." |
  | **For Her** (women) | Hawas Diva, Angham, Pride Nebras ⚠️ *(was Yara)* | TT$150 / TT$280 | "These are some of the best smelling scents around. Guaranteed she will love AT LEAST one." |

  Sets are Tier A only, **except the Fete Pack and Date Night**, which each include one A+ scent and are priced up to match.

  A 10ml costs TT$100 on its own, ~TT$93 in a set and TT$70 in the 5×10ml bundle. Sets don't also get the free 5ml (one offer per order). Someone buying three 10ml decants who just wants the most perfume will take three singles plus the free 5ml (TT$300). The TT$280 set is for people who want you to choose for them, or want a gift box. No vouchers for now: printed vouchers rarely get used in TT, so they'd waste printing time. Keep the idea for later, as a digital code on your own website in Phase 2.

**Designer decants from your own bottles:** at replacement cost (Eros landed ≈ TT$7.44/ml), a 10ml at TT$125 earns ~33% margin. That's thin, and it's fine. Designer decants bring people in, and your margin comes from the Arabian tier.

### 2.4 Decant margins on the launch buy (prices after EXTRA20 + EXTRA10, including 7% tax)

Landed costs come from one consolidated Websource shipment of the 12 Jomashop bottles (~15 lb), shared by value, using the recalibrated rates in §2.1.

| Scent | Source | Price each | Landed TT$ | 5ml margin | 10ml margin | 15ml margin | 10ml in TT$350 bundle |
|---|---|---|---|---|---|---|---|
| **Rayhaan Aquatica** | **Local Rayhaan dealer** | TT$300 | **300** | 60% | 58% | 60% | 41% |
| Rasasi Hawas Ice | Jomashop | $24.98 | 295 | 61% | 59% | 61% | 41% |
| Lattafa Pride Nebras | Jomashop | $24.99 | 296 | 61% | 59% | 61% | 41% |
| French Avenue Liquid Brun (original 100ml EDP) | Jomashop | $29.99 | 355 | 56% | 53% | 55% | 32% |
| Lattafa Angham | Jomashop | $33.00 | 390 | 52% | 49% | 51% | 27% |
| Rasasi Hawas Diva | Jomashop | $35.00 | 414 | 50% | 46% | 48% | 23% |
| **Lattafa Musamam Black Intense** | Jomashop | $44.99 | 532 | **A+:** 49% | **A+:** 45% | **A+:** 45% | *not in bundle* |

**Local Rayhaan at TT$300 beats importing.** The same bottle lands at ~TT$360 through Jomashop and Websource (it was in the cart and was moved to the local dealer on 5 Oct), and there's no shipping wait or customs risk. Ask the dealer for a receipt every time, as authenticity proof, and confirm they're an authorized distributor.

### 2.4a Sealed bottles at launch (one per scent, priced to the local market)

**Prices reset by the owner on 6 Oct 2026** to sit just under local competitors. One local seller lists Musamam Black Intense at TT$600 and Liquid Brun at TT$525, both sold out. Landed costs are unchanged (same cart, same coupons, same rates).

| Scent | Landed TT$ | Sealed price | Profit | Margin | Was (5 Oct) | Market reference |
|---|---|---|---|---|---|---|
| Rasasi Hawas Ice | 295 | **TT$499** | 204 | 41% | 550 → profit 255 | KmG TT$599.99, sold out ✅ |
| Rayhaan Aquatica | 300 | **TT$450** | 150 | 33% | 475 → 175 | KmG sells other Rayhaans (Obsidian, Terra) at TT$499 ✅ |
| French Avenue Liquid Brun (100ml EDP) | 355 | **TT$499** | 144 | 29% | 475 → 120 | A local seller TT$525, sold out ✅; KmG sells the 150ml LTD at TT$550 ✅ |
| Lattafa Pride Nebras | 296 | **TT$425** ⚠️ | 129 | 30% | unchanged | Not found locally yet |
| Lattafa Angham | 390 | **TT$475** | 85 | 18% | 525 → 135 | Owner's price; not found locally yet |
| Lattafa Musamam Black Intense | 532 | **TT$599** | 67 | **11%** | 699 → 167 | A local seller TT$600, sold out ✅; FF sold out in every size ✅ |
| Rasasi Hawas Diva | 414 | **TT$450** | 36 | **8%** | unchanged | KmG TT$450 ✅ |
| **All 7** | **2,582** | **TT$3,397** | **~815** | 24% | 3,599 → ~1,017 | |

*Landed costs from [landed_cost.py](landed_cost.py): the 12 Jomashop bottles at US$385.90 after EXTRA20 + EXTRA10, + 7% tax = US$412.91 (TT$2,816), plus Websource fees of US$256.31 (TT$1,748) on ~15 lb, shared by value. Aquatica is TT$300 from the local dealer.*

⚠️ **These fees are a model, not a bill.** The TT$1,748 is a full-value estimate from one past invoice, and that invoice was taxed below its real value (§2.1). When the launch order is picked up in week 3, put the **actual Websource charge** into the numbers and redo §2.4a, §2.7 and §10. If Websource charges noticeably less, every sealed margin improves and Musamam stops being thin. If it charges more, revisit the Musamam and Angham prices before listing them.

**What changed:** sealed revenue drops by **TT$202** (3,599 → 3,397), and so does sealed profit (~1,017 → ~815). The price cuts on Hawas Ice (−51), Musamam (−100), Angham (−50) and Aquatica (−25) outweigh the +24 on Liquid Brun.

**Thin bottles, and whether to still sell them sealed:**
- **Hawas Diva, TT$36 (8%).** No change: cash recovery only (below).
- **Musamam Black Intense, TT$67 (11%), down from TT$167.** Now the weakest sealed sale in TT$ terms after Diva, and it fails the Phase 2 restock rule (landed + 20% ≤ local price). Decanted at A+ prices, the same bottle brings ~TT$1,100 (~TT$540 profit after supplies). **Still sell it sealed at launch:** in the expected case it's the week 7 sale, and without its TT$599 the card would be ~TT$170 short on 5 Dec. But don't push it ahead of the others. If it hasn't sold by mid-December, decant it. **Don't restock it as a sealed bottle unless Jomashop has it at ≤ ~US$42** after coupons.
- **Angham, TT$85 (18%), down from TT$135.** Thin but positive, and it still just passes the restock rule (landed 390 + 20% = 468 ≤ 475). Fine to sell sealed at launch; restock sealed only at ≤ ~US$33 after coupons.
- Every other bottle still earns TT$129–204. **None is negative.**

**Price rule (owner, 5 Oct 2026; applied 6 Oct): match the market.** Sit at or just under the going local price. Where no local price exists (⚠️, now only Pride Nebras), start at landed + ~25% and adjust once you see one.

**Hawas Diva is mostly a cash-recovery sale.** It's a strong seller, but at full declaration US$35 becomes ~TT$414 landed, against KmG's TT$450 shelf price. Selling it sealed gets the money back quickly for ~TT$36 profit. Decanted, the same bottle brings ~TT$1,000. Fine for the first one at launch; don't restock Diva as a sealed bottle unless it drops below ~US$28.

**Keep boxes on.** Tell Websource not to remove outer cartons on this shipment: the sealed bottles must arrive boxed and in cellophane.

### 2.5 Break-even

- **Per bottle (decanted):** a TT$295 bottle (Hawas Ice) is paid back after **~4 × 10ml or ~7 × 5ml sales (~40% of the bottle)**. Everything after that is profit.
- **Per bottle (sealed):** one sale, paid back on the spot. The 7 sealed bottles return TT$3,397 against TT$2,582 landed.
- **Per month:** fixed costs in Phase 1 are ~TT$300–550 (ads, data, misc). At an average decant order of ~TT$130 with ~TT$65 contribution, that's **5–9 orders/month**.
- **Launch capital:** the full launch outlay is ~TT$5,700 (§2.6). The 7 sealed bottles cover ~59% of it; decant sales cover the rest, **~18 decant orders** at TT$130 average.

### 2.6 Capital split (launch outlay ≈ TT$5,700: US$495 on the card + TT$2,348 paid at pickup)

| Bucket | USD | TTD | Notes |
|---|---|---|---|
| 12 bottles at Jomashop: 2 each of Liquid Brun, Hawas Ice, Hawas Diva, Angham, Pride Nebras, Musamam Black Intense (US$385.90 after EXTRA20 + EXTRA10, + 7% tax, free shipping) | $413 | 2,816 | One order, placed on or after 17 Oct. **Rayhaan Aquatica was removed from the cart** (cheaper locally) |
| Decant supplies, landed | $82 | 560 | ~45×10ml, 35×15ml, 30×5ml, gift boxes for curated sets, labels, bags, pipettes/syringes, funnel |
| **Total charged to card** | **$495** | **3,376** | ✅ **Under the US$600 ceiling**, as long as the Websource fees go on debit or cash |
| Websource fees for the 12 bottles (duty, OPT, VAT, freight; ~15 lb) | $256 | 1,748 | **Paid at pickup in week 3, by debit or cash, not the card** |
| 2 Rayhaan Aquatica from the local dealer | — | 600 | Week 3: one sealed for sale, one to decant. **Rayhaan Elixir dropped** (owner, 5 Oct) |
| **Total launch outlay** | | **5,724** | |
| Business registration | (from sales) | 245 | Pay in week 4 from revenue |

⚠️ **Coupons:** EXTRA20 and EXTRA10 were both live in the cart on 5 Oct. Check they still apply on 17 Oct. Without them the 12 bottles cost ~US$506 with tax, so the card would be ~US$588 with supplies: still under the ceiling, but with almost no room. If anything else gets added, put the supplies on debit.

### 2.7 Week-by-week cash flow, first 7 weeks (TTD)

Week 1 starts **Sat 17 Oct**, the day after the statement closes. **Payment is due Sat 5 Dec, at the end of week 7.** Card charges: 12 Jomashop bottles + supplies (TT$3,376). Paid outside the card in week 3: Websource fees (TT$1,748) and 2 local Rayhaans (TT$600).

| Week | What happens | Card charges | Decant sales | Sealed bottle sales | Ops out | Expected cumulative net | Conservative cumulative | Optimistic cumulative |
|---|---|---|---|---|---|---|---|---|
| 1 | Order 12 bottles (one Jomashop order, both coupons) and supplies (Amazon). Claim @smellbess, set up WhatsApp Business. Teaser posts. Start a pre-order list with coworkers and friends | 2,816 + 560 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | Goods reach Miami and fly. Post "what's coming" and "bottles in stock for Christmas". Take bottle reservations (50% deposit) | 0 | 0 | 0 | 0 | 0 | 0 | 300 |
| 3 | **Pick up from Websource and pay fees (TT$1,748). Buy 2 Rayhaan Aquatica (TT$600).** Decanting session. Soft launch: fill reservations, first Saturday pickup | 0 | 600 | 949 | 2,348 | −799 | −1,499 | 300 |
| 4 | Public launch. Register business name. First small boosted post | 0 | 700 | 925 | 395 | 431 | −894 | 2,379 |
| 5 | Curated-set and 5×10ml bundle push, Christmas gift posts | 0 | 650 | 499 | 0 | 1,580 | −544 | 3,854 |
| 6 | DNA-comparison content. Boost the best post | 0 | 750 | 425 | 150 | 2,605 | 156 | 4,804 |
| 7 | Restock supplies (small). **Pay the card in full by 5 Dec (TT$3,376).** | 0 | 700 | 599 | 100 | **3,804 → +428 after paying card** | **931 → −2,445** | **5,804 → +2,428** |
| 8+ | Christmas rush. Repay any salary top-up first, then reorder bestsellers as decant stock | | 800+ | | | | | |

*Ops out in week 3 = Websource fees + the 2 Rayhaans; week 4 = TT$245 registration + TT$150 ads (skipped in the conservative case). Expected sealed sales, at the 6 Oct prices: Hawas Ice + Aquatica (wk 3, TT$949), Angham + Diva (wk 4, TT$925), Liquid Brun (wk 5, TT$499), Nebras (wk 6, TT$425), Musamam (wk 7, TT$599). Conservative: 4 of the 7 sealed bottles sell by 5 Dec (Hawas Ice wk 3, Aquatica wk 4, Diva wk 6, Angham wk 7: TT$1,874), decants 350 / 400 / 350 / 400 / 400. Optimistic: all 7 gone by week 5 (Hawas Ice, Aquatica and Liquid Brun wk 3; Musamam, Diva and Nebras wk 4; Angham wk 5), decants 300 / 900 / 1,000 / 1,000 / 1,100 / 1,100. Delivery fees pass straight through to customers and are excluded.*

**Reading it honestly:**
- **Expected:** the card is still covered on 5 Dec, with **~TT$430 to spare** (down from ~TT$630 at the 5 Oct prices). That's the bottle strategy working: sealed bottles return ~TT$3,400 in five weeks. The cushion is thinner, though: it now depends on Musamam (TT$599) selling by week 7. You do front **~TT$2,350 in week 3** (Websource fees and Rayhaans) from salary or savings; it's back by week 4.
- **Conservative:** you're ~TT$2,450 short on 5 Dec (was ~TT$2,300) and cover it from salary, but you'd still hold 3 sealed bottles (Liquid Brun, Nebras, Musamam: ~TT$1,500) plus decant stock going into the Christmas weeks, so the money is tied up, not lost. **Decide now that you'll pay the card in full regardless.** Treat any shortfall as a loan to the business, repaid first from week 8+ sales.
- **Cash rule:** every sale goes into a separate "card" savings account until TT$3,376 (the card) is covered, then repay the TT$2,348 you fronted. No restocks before that, except supplies needed to fill orders.

---

## 3. Launch lineup and sourcing

### 3.1 Launch buy (locked, 5 Oct 2026, revised that evening)

**7 bought scents, 2 bottles each (14 bottles), plus 2 from your shelf (§3.2). Order the 12 Jomashop bottles on or after Sat 17 Oct in one order with EXTRA20 + EXTRA10. Buy the 2 Rayhaans locally in week 3.** For each scent, one bottle stays sealed for sale and one is decanted (§1).

| # | Scent | For | Source | Price each (after coupons) | Qty | Tier | Sealed bottle price |
|---|---|---|---|---|---|---|---|
| 1 | French Avenue Liquid Brun (**original 100ml EDP**; the LTD Extrait stays on the research list until you've smelled it) | Men | Jomashop | $29.99 | 2 | A | TT$499 |
| 2 | Rasasi Hawas Ice | Men | Jomashop | $24.98 | 2 | A | TT$499 |
| 3 | Rasasi Hawas Diva | Women | Jomashop | $35.00 | 2 | A | TT$450 |
| 4 | Lattafa Angham | Unisex | Jomashop | $33.00 | 2 | A | TT$475 |
| 5 | **Lattafa Pride Nebras** (new) | Unisex | Jomashop | $24.99 | 2 | A | TT$425 ⚠️ |
| 6 | **Lattafa Musamam Black Intense** (new; FF sold out in every size) | Men | Jomashop | $44.99 | 2 | **A+** (70 / 120 / 175) | TT$599 |
| 7 | Rayhaan Aquatica | Men / unisex | **Local Rayhaan dealer** | TT$300 | 2 | A | TT$450 |

**Moved to the next order (still on the Bess List):** Khamrah, Khamrah Qahwa, Yara (pink), **Supremacy Collector's Edition** (a must-have), Asad Bourbon. **Dropped:** Rayhaan Elixir (owner, 5 Oct). Rebuy the next batch from Christmas sales (§2.7 week 8+), watching for Jomashop coupons.

**Gender split:** 3 men's, 3 unisex (Angham leans feminine, Pride Nebras is sweet and wearable by anyone), 1 women's (Hawas Diva). Women's designers come from the girlfriend's own bottles later.

### 3.2 Decant from your own shelf (2–4 scents, no new spend)

**Confirmed (5 Oct 2026), no purchase needed:**
- **Al Haramain Amber Oud Gold Edition**, ~50ml, Tier A+. In the Fete Pack. Decants only (it's a partial bottle).
- **Arabiyat Prestige Marwa**, ~80ml, Tier A. Single decants, and the draft third scent in the Office/School set. Decants only.

Cost basis is replacement cost (Amber Oud Gold ≈ TT$550 per 120ml, Marwa ≈ TT$441 per 100ml). **No designer decants at launch (owner, 5 Oct 2026): Arabians only.** Add designers later from admin.


Pick 2–3 designers you own and are willing to drain, e.g., **Versace Eros, Dior Sauvage, JPG Le Male Elixir**, plus a women's designer you or your girlfriend own (e.g., an Ariana Grande, YSL Libre, or Born in Roma Donna). Price at Tier D. Set the cost basis at **replacement cost** (e.g., Eros landed ≈ TT$707 → TT$7.44/ml), not zero, or you'll underprice.

**Result at launch: 9 scents (7 bought + 2 from the shelf), all Arabian, with 7 sealed bottles for sale.** Designers and more women's scents come later.

### 3.3 Yield per bottle and restock rules

- **Sealed or decant:** of each pair, **decant the bottle with the worse box** and keep the best-looking one sealed. Never open, test or spray the sealed bottle. When it sells, the scent shows as decants-only.
- **Usable yield: ~95ml from a 100ml bottle.** You lose 3–5ml to the dip tube, transfer and testing.
- **Starting decant mix per bottle:** about 4×10ml + 2×15ml + 5×5ml (95ml, ~TT$1,000 at list prices). Don't decant the whole bottle on day one. Decant ~50% and fill the rest to order, which keeps you flexible on sizes.
- **Restock** when a bottle drops below 30ml **and** sold ≥60ml in the last 6 weeks.
- **Watch** if it sold 20–60ml in 6 weeks: keep it, but don't reorder yet.
- **Retire** if it sold <20ml in 6 weeks: use it for curated sets and free 5ml decants, and don't reorder.
- **Tracking:** a simple Google Sheet (bottle ID, ml remaining, sales by size, date opened). You're IT, so this can later become your website's inventory backend.

### 3.4 Confirm with Websource (before scaling up)

☑ **Flying perfume is confirmed** from your own shipments and from local sellers who use Websource. Ask the questions below before your shipments start to look commercial.

1. **Do you fly perfume?** Is there a hazmat/dangerous-goods surcharge, a quantity limit per shipment, or sea-only routing?
2. Billing basis: actual or volumetric weight? Do you round up per lb **per package or per shipment**? Is there a minimum?
3. Consolidation: fee to combine multiple packages? How long do you hold packages while waiting?
4. Can you repackage (remove outer cartons) and does that reduce volumetric weight?
5. **Commercial imports:** at what quantity or value do you treat a shipment as commercial and require a C82 entry or customs broker? What's the fee? Do you broker it?
6. Insurance: what does it cover for breakage or leaks? How do claims work?
7. Do you need the supplier invoice uploaded before arrival to avoid delays (yes: always upload it)?

### 3.5 Confirm with TT Customs & Excise (or a customs broker)

1. HS classification **3303.00.90** at **20% duty**. Is that correct for both EDP and EDT, and for empty glass atomizers (likely a different heading)?
2. Does **OPT 7%** apply to goods imported for resale, or only personal online purchases?
3. What do you need to import commercially: an importer registration on **TTBizLink/ASYCUDA**, a BIR number, or anything else?
4. Will repeated imports of multiple identical bottles be flagged as commercial, and what's the process when that happens?
5. Is any **permit or registration with the Chemistry, Food & Drugs Division** required to import or sell cosmetics/fragrances for resale? ⚠️ I couldn't verify this, so ask directly.

### 3.6 Avoiding fakes

- **Buy only from Jomashop, FragFlex** (⚠️ verify FragFlex's reputation on r/fragrance and Basenotes before big orders), **Lattafa-USA, or brand-authorized retailers.** No Amazon third-party sellers, eBay, AliExpress, or local "wholesale" deals that seem too good.
- On arrival: check the batch code against the box ([checkfresh.com](https://www.checkfresh.com)), cellophane quality, print alignment, sprayer quality, and juice color against reference photos.
- **Photograph every unboxing with the invoice in shot.** That's your authenticity proof for customers and your defense if challenged.

---

## 4. Positioning against KmG and SA Exclusive

| | **KmG Scents** | **SA Exclusive** | **Fragrance Fanatics T&T** | **You** |
|---|---|---|---|---|
| Strength | Great decant prices, 5×10ml Arabian bundle for TT$300 ✅ | Wide full-bottle range and depth (Armaf, Afnan, Al Haramain, designers) ✅ | Website, **free delivery** (you won't match it, so compete with pickup and drop-offs), 3/8/10/15/30ml sizes, 10% off decants over TT$500 ✅ | Expertise and curation, "his and hers" perspective, speed, a website you build yourself, **sealed bottles and decants of the same scent** (try it, then buy the bottle), a premium look none of them have |
| Weakness | Small catalog, frequent stockouts, limited content and education | Weak website, full bottles only | Frequent stockouts, no curated sets | New, no reviews yet |
| How you win | Better guidance on *what to buy* | Decants let people try before buying | Personality and content | **"Try before you commit. Honest reviews from someone who actually wears this stuff."** |

**Your angle (don't compete on price alone):**
1. **Curated, not exhaustive. The name says it: only bess scents.** A "Hall of Fame" of 12–20 scents you personally vouch for, each with an honest card: performance in TT heat, occasion (office / lime / fete / date), compliment rating, and "smells like".
2. **Curated sets are the entry product.** For example, a "Fete Pack", "Office Safe Pack", "Date Night Pack" or "Her Gourmand Pack", each in a gift box with scent cards as **3×5ml for TT$150** or **3×10ml for TT$280**. Neither KmG nor FF sells curated sets, and they turn browsers into buyers.
3. **Couple-run, his and hers.** Your girlfriend covers women's scents. Couple-style content ("which one does she like on me?") performs well and builds trust.
4. **Speed and reliability:** in-stock decants delivered or picked up within 72 hours. Same-week Saturday pickup. Competitors are often sold out, so **never run out of your core 10.**
5. **Ordering experience:** clean ordering on Take App now, then smellbess.com: scent cards, "smells like" search and quick WhatsApp checkout.
6. **Authenticity shown, not claimed:** unboxing videos with invoices visible.

### Price comparison (TTD) ✅ = from seller's site or your screenshots · ⚠️ = third-party/unverified · — = not listed

**Decants**

| Scent | KmG 5ml / 10ml | Fragrance Fanatics 10ml / 15ml / 30ml | Your price 5 / 10 / 15ml |
|---|---|---|---|
| Lattafa Khamrah | 60 / 100 ✅ | — | 60 / 100 / 150 |
| Rasasi Hawas Ice | 60 / 100 ✅ (10ml: 4 left) | — | 60 / 100 / 150 |
| Rasasi Hawas Diva (W) | 60 / 100 ✅ | — | 60 / 100 / 150 |
| Afnan 9PM Night Out | 60 / 100 ✅ | — | 9PM original: 60 / 100 / 150 |
| French Avenue Liquid Brun LTD Extrait | 60 / 100 ✅ | — | Phase 2 candidate |
| AH Amber Oud Aqua Dubai | 60 / 100 ✅ | — | Phase 2 candidate |
| Lattafa Vintage Radio | 60 / 100 ✅ | — | Phase 2 candidate |
| Lattafa Fakhar Black | 60 / 100 ✅ | — | — |
| Lattafa Musamam Black Intense | — | 100 / 150 / 250 ✅ | A+: 70 / 120 / 175 |
| Arabiyat Prestige Marwa | — | 100 / 150 / 250 ✅ | — |
| Rayhaan Elixir | — | **80** / 100 / 180 ✅ | — |
| Versace Dylan Blue | 75 / 120 ✅ | — | D1: 75 / 125 / 185 (e.g., Eros from your shelf) |
| Guerlain L'Homme Idéal Intense | 70 / 130 ✅ | — | — |
| Valentino Born in Roma Intense | 120 / 200 ✅ | 200 / 275 / 450 ✅ | D2: 120 / 200 / 275 |
| Jo Milano Game of Spades Full House | 100 / 180 ✅ | — | — |
| Bundles / discounts | **5×10ml Arabian TT$300** (only bundle; the 5ml bundles were dropped) ✅ | 10% off decant orders ≥ TT$500 ✅ | **5×10ml TT$350** · free 5ml with 3+ decants of 10ml or larger · curated sets: 3×5ml TT$150 / 3×10ml TT$280 |

**Full bottles** (compared with your landed cost at full declaration)

| Scent | KmG | SA Exclusive | Other | Your landed cost | Verdict |
|---|---|---|---|---|---|
| Armaf CDNIM 105ml | — | 525 ✅ | — | ~470 | Skip for now |
| Afnan 9PM 100ml | 525 (Night Out, sold out) ✅ | 650 ✅ | — | ~399 | Pre-order ~TT$500 |
| Rasasi Hawas Ice 100ml | 599.99 (sold out) ✅ | — | — | **~295 (sale + coupons)** | **Sealed at TT$499 (launch)** |
| Rasasi Hawas Diva 100ml | 450 ✅ | — | — | ~414 | **Sealed at TT$450 (launch, mostly cash recovery)** |
| Lattafa Angham 100ml | — | — | — | ~390 | Sealed at TT$475 (launch) |
| French Avenue Liquid Brun 100ml EDP | — | — | Local seller 525 (sold out) ✅ | ~355 | **Sealed at TT$499 (launch)** |
| Lattafa Pride Nebras 100ml | — | — | — | ~296 | Sealed at TT$425 ⚠️ (launch) |
| Lattafa Musamam Black Intense 100ml | — | — | Local seller 600 (sold out) ✅; FF sold out ✅ | ~532 | Sealed at TT$599 (launch, thin: ~TT$67 profit) |
| Rayhaan Aquatica 100ml | Other Rayhaans 499 ✅ | — | — | 300 (local) | **Sealed at TT$450 (launch)** |
| Lattafa Vintage Radio 100ml | 499 ✅ | — | — | ⚠️ ~400 | Pre-order possible |
| Liquid Brun LTD 150ml | 550 ✅ | — | — | ⚠️ ~480 | Decants only |
| AH Amber Oud Aqua Dubai | 500 ✅ | 795 ✅ | — | ⚠️ ~560 | Decants only |
| Versace Dylan Blue 100ml | 625 ✅ | — | — | ⚠️ ~707 | Decants only |
| AH Amber Oud Dubai Night | 700 ✅ | 795 (75ml) ✅ | — | — | — |
| Guerlain L'Homme Idéal Intense | 700 ✅ | — | — | ~902 | Decants only |
| Afnan 9AM / Armaf Lionheart 100ml | — | 450 / 550 ✅ | — | — | — |
| Lattafa Yara | — | — | 450 ⚠️ | ~292 | **Pre-order ~TT$380** (next order) |
| Lattafa Khamrah | — | — | — | ~359 | **Pre-order ~TT$425** (next order) |

*Landed costs marked ⚠️ assume typical Jomashop prices that I haven't checked for that scent. Rows for scents outside the launch buy still use the older, higher fee model; they're ~8% too high.*

**What the screenshots tell you:**
1. **The Arabian decant price is set by the market** at TT$60/100. Nobody competes on it, so you shouldn't either.
2. **Most shops have stock gaps.** Many KmG and FF listings were sold out (Hawas Ice 100ml, 9PM 100ml, BIR Intense, Jo Milano, Musamam, Rayhaan, Marwa 15ml), and Hawas Ice 10ml was down to 4 left. **Reliable stock of your core 10–12 scents is a real advantage**, and it's much easier with a small curated lineup.
3. **The 15ml looks like FF's best seller.** It's the size most often sold out (Marwa, Musamam). FF prices it at the same TT$10/ml as the 10ml. Copy that.
4. **Neither shop offers curated sets, and KmG's only bundle is built for bulk buyers.** Guided first purchases are your opening.

**Still missing (optional):** FF's 3ml and 5ml vial prices, and Instagram/TikTok/Marketplace sellers. The tables above are enough to set prices.

---

## 5. Sales channels and storefront

| Option | Cost | Pros | Cons | Verdict |
|---|---|---|---|---|
| **Instagram + WhatsApp Business** | Free | Where TT buyers already are. Catalog plus quick replies | Manual order taking | **Phase 1 core** |
| **TikTok** | Free | Best organic reach for "smells like X" content | Takes time to produce videos | **Phase 1 core** (batch filming) |
| **Take App (Basic)** | Free, 50 orders/mo ✅ | Built for WhatsApp ordering, takes 10 minutes to set up, no commission | Card payments and custom domain need Business at **US$50/mo** ✅ (too expensive for now) | **Phase 1 storefront** |
| **smellbess.com** (self-built; see `website-brief.md`) | ~US$10–15/yr domain (Namecheap) + US$0–20/mo hosting | Fully yours: scent cards, "smells like" search, curated sets and the offers engine, SEO pages ("Aventus alternative Trinidad"). This is the main way you stand out from competitors | Your build time | **Build now and launch with it.** Keep Take App or the WhatsApp catalog as a fallback until the site is live |
| **WooCommerce** | Hosting ~US$3–10/mo ⚠️ | Mature, WiPay plugin may exist ⚠️ | You'd have to maintain WordPress | Only if you need real card checkout |
| **Shopify** | ~US$29–39/mo ⚠️ | Polished | Shopify Payments isn't available in TT ⚠️, so you'd need third-party gateways. Overkill for a solo operator | Skip for now |
| **Facebook Marketplace / groups** | Free | Older and wider audience | Lots of tire-kickers | Post weekly, low effort |

**Payments (TT):** online bank transfer (Republic, RBC, Scotia, FCB) for free · cash at pickup/COD · **WiPay** for card and online payments ⚠️ (check fees, likely ~3–4%) · **Endcash** (Republic mobile wallet) ⚠️. PayPal is unreliable for receiving payments in TT ⚠️. Require **payment before dispatch for delivery orders**. Allow cash only for pickup.

**Website decisions (owner, 5 Oct 2026):**
- **Hosting:** Netlify free plus Supabase free (database and admin login). **No custom domain yet:** launch on the free **smellbess.netlify.app** address (claim that site name when the Netlify site is created). smellbess.com can come later.
- **Bank details are never on the website.** The order goes to WhatsApp, and you reply there with the bank details. Personal accounts for now; switch to a business account once the name is registered.
- **Order alerts:** both admins get an email when an order is saved, as well as the customer's WhatsApp message.
- **Pickup stops and times** can be changed from admin (change a time, pause a stop, skip a Saturday).
- **Free 5ml:** the cart shows a "you qualify" card with a small animation. The customer doesn't pick a scent; we choose it (§2.3b).
- **Workplace hand-off** stays off the public site. **Tobago** is shown at TT$90 (ODeliver TT$60 + TT$30 inter-island). **No own-drop-off option** (§7.4).
- **Scent copy:** Claude drafts it, and the two of you edit it in admin.
- **Photos:** start with the brand's own product images, downloaded and hosted on our site rather than linked from theirs. Move to your own bottle shoots once you have a light setup and backdrop.
- **Designer decants:** none at launch, Arabians only. Add them later in admin.
- **Curated sets:** the owner picked the 4 launch sets and wrote their copy (§2.3b). Three sets need their scents re-confirmed after the cart change.
- **No stock counts on the site (owner, 6 Oct 2026):** never "1 left" or "2 left in 10ml". A size or bottle is simply available or not; admin still sees the real numbers.
- **Sealed bottles in stock (5 Oct 2026, evening):** the site sells one sealed bottle per launch scent at its own price, alongside the decants. When it sells, the scent page shows decants only. Out-of-stock bottles fall back to "Pre-order, 50% deposit". Sealed bottles don't count toward the free 5ml or the bundle.
- **Look:** the site follows the brand in §5a (Night, Pearl, Amber; Archivo; the wide wordmark and seal).

## 5a. Brand (locked 5 Oct 2026)

**Direction: quiet luxury.** "Bess" means the best, so the brand should look like it. The full brand pack (logo, seal, colour, type, voice, packaging, social) is the design canvas at https://claude.ai/artifact/UofYt4NYKqVGszxNcpQXcw.

| Element | Decision |
|---|---|
| **Wordmark** | SMELL BESS in Archivo Expanded Light (width 125, weight 300), all caps, letter-spacing 0.22em, **BESS in Amber** (owner, 6 Oct 2026), with a short Amber rule beneath where there's room. Descriptor: **FINE FRAGRANCE** (not "decants", since we sell bottles too). In sentences the name is always **Smell Bess** |
| **Monogram** | S and B split by a thin Amber line. Profile photos, favicon, atomizer caps |
| **Seal** | Thin double rings, "SMELL BESS · ONLY THE BEST · TRINIDAD & TOBAGO" around the edge, the monogram in the middle, "EST. 2026". Pearl on Night, Night on Pearl, or a solid Amber sticker that closes every pouch |
| **Tagline** | *Only the best.* |
| **Colour** | Night #121014 (ground, ~70%) · Smoke #1E1B21 (surfaces) · Pearl #EAE8E5 (text, labels) · Ash #8F8A93 (quiet text) · **Amber #E3A23B, the only accent** (wordmark rule, prices, main button; under 5%). Text on Amber is always Night. No gold foil, no gradients |
| **Type** | Archivo only. Expanded Light caps for display; normal width for headings and body; Expanded Medium caps, tracked 0.24em, for labels and prices |
| **Tier marks** | A: Pearl outline · A+: Pearl filled · D1: Amber outline · D2: Amber filled |
| **Voice** | Assured, discerning, warm, quietly local. Calm statements, no exclamation marks, no hype, no fake scarcity. One Trini touch per piece at most; "Smell bess." works as a sign-off |
| **Packaging** | Matte black decant labels with Pearl text (scent name is the hero), a stock matte black pouch closed with the Amber seal, a Night "Thank you for choosing the best." card, and a Pearl card for the free 5ml ("A 5ml, chosen by us.") |
| **Photography** | Low light, one light source, dark backdrop, real hands and skin. No marble, no stock, no bottles floating on gradients |

**Must not look like:** cream-and-serif luxury, gold-foil perfume-shop templates, or anything that borrows a designer house's branding.

---

## 6. Marketing: 90-day launch plan

The brand is **you**: the enthusiasts with the best shelf in Trinidad, who'll tell people what actually works in TT heat. The look is quiet luxury and the tone is assured, honest and warm (§5a). Keep the fun in the content, not in loud graphics.

**Christmas angle:** sealed bottles are the easy gift. From week 2, post "in stock for Christmas" with the 7 sealed bottles, take reservations with a 50% deposit, and point bottle buyers to the decants of the other scents.

| Days | Focus | Actions | Target |
|---|---|---|---|
| **1–30 (Oct–early Nov)** | Pre-launch and soft launch | Pick a name and handles. 9 grid posts before launch (lineup reveal, "who we are", "how decants work"). Unboxing reel. WhatsApp broadcast list (coworkers, friends, family). Soft-launch pre-orders | 150 followers · 50 on broadcast list · 25 orders |
| **31–60 (Nov–Dec)** | Christmas gifting | **Gift curated sets** ("for him / for her / couples") in nice packaging. 3 posts and 5–7 stories a week. 1 TikTok every 2–3 days. Saturday pickups. First TT$150–300 in boosted posts on the best-performing reel | 40+ orders/month · first 10 Google/IG reviews |
| **61–90 (Dec–Jan)** | Carnival season (Carnival is **8–9 Feb 2027**) | "Fete Scents" pack, "beast-mode performance in heat" tests, Valentine's pre-orders (14 Feb). Referral program live. 1 pop-up at an office or market | 25% repeat rate · 5 referrals/month |

**Content ideas (batch-film 6–8 on a Sunday):**
- **"Smells like X for less":** side-by-side blind test of a clone vs the original (use your own designer bottle). Your girlfriend guesses.
- **"I wore it in TT heat":** 8am spray, 4pm check-in. Honest longevity.
- **Compliment counter:** wear one scent all week and count the compliments.
- **"Office safe vs Lime vs Fete"** tier list.
- **Her vs his:** "which scent does she like on me?" reaction videos.
- **Layering:** pairings from the lineup (test them first; only post the ones that work).
- **"Try it, then own it":** the decant on Monday, the sealed bottle by Friday.
- **"Don't blind buy this":** honesty builds trust and sells more decants.
- **"New drop Friday"** stories.

**Referral and loyalty:**
- **Give TT$20, get TT$20** (credit on the next order over TT$100).
- **Stamp card:** buy 5 decants, get a 5ml free. Track by phone number in your sheet.
- **Surprise free 5ml (our pick, Tier A) with 3+ decants of 10ml or larger, any tier.** This replaces a freebie on every order. It costs ~TT$27, so only bigger orders get it. It seeds the next sale and moves slow sellers.

---

## 7. Operations

### 7.1 Weekly rhythm (~8–10 hrs/week)

| When | Task | Time |
|---|---|---|
| Daily | DMs, WhatsApp orders, confirm payments | 15–20 min |
| Wed evening | Optional Wednesday pickup *(add only once Saturday volume justifies it)* | 1 hr |
| Thu evening | **Decanting session**: fill the week's orders plus a small buffer | 1.5–2 hrs |
| Fri | Book ODeliver for delivery orders (or keep any you can drop yourself on Saturday), post "new drop" | 30 min |
| Sat | **Pickup route:** Price Plaza Chaguanas 10am → MovieTowne POS 1pm → East Gates Mall 5pm. Use ~30-minute windows at each stop; customers confirm their stop by Friday night | ~8 hrs including travel (it's a full day, so batch orders by stop and send a Friday reminder) |
| Sun | Batch-film content, update inventory sheet, place weekly consolidated order | 2 hrs |

### 7.2 Decanting process and hygiene

1. Clean workspace, ventilated, away from heat and sun. Nitrile gloves.
2. Use **new atomizers only, never reuse.** Wipe the exterior after filling.
3. Transfer with **sterile syringes/pipettes, one per scent** (or rinse with perfumer's alcohol and dry fully between scents). For bottles with crimped caps, use a spray-to-spray decanting adapter.
4. Fill, cap and test-spray once. **Label immediately.** Never have two unlabeled decants on the table.
5. Log each fill: bottle ID, ml, date.
6. Store finished decants upright in a cool, dark box.

**Label contents:** scent name and house · size · "Decanted from authentic bottle" · your brand and IG handle · batch/date code · "Flammable. Keep away from heat and children. External use." Add an "inspired by" line on clones *only* as a description (e.g., "DNA: fresh pineapple-smoky"). **Don't use the designer's logo or claim it's the original.**

### 7.3 Order flow

```
Website / DM order → WhatsApp message → confirm stock + total + delivery method
→ reply on WhatsApp with bank details (never on the website); transfer before dispatch; cash OK for pickup and workplace
→ add to Thursday batch → decant, label, pack (+ our-pick free 5ml if 3+ decants of 10ml+, thank-you card)
   sealed bottle: check the cellophane, bubble-wrap the box, seal the pouch; mark the bottle sold in admin so the scent switches to decants-only
→ Saturday pickup / workplace hand-off / ODeliver (or your own drop if you're passing) → send tracking + "how to wear it" tip
→ Day 7 follow-up: "How's it performing?" → review request + referral code
```

### 7.4 Delivery: customer pays, no free delivery

**ODeliver's published rates** (Standard account, TTD) ✅:

| Hub & Spoke, Small package (≤30 lb) | Urban | Rural | Extended | Remote | Tobago |
|---|---|---|---|---|---|
| **Standard account** | **30** | **40** | **50** | **60** | 60 (+30 inter-island ⚠️) |
| Corporate account | 35 | 45 | 55 | 65 | 65 |

- **Instant delivery** (by distance): TT$25 (0–2 km), TT$35 (2–5 km), TT$40 (5–8 km), TT$50 (8–12 km), TT$55 (12–16 km), TT$65 (16–20 km), then up to TT$300 at 100 km. There's also a 5% service fee ✅.
- **Additional fees:** extra small package +TT$20 · COD handling **3% of the amount collected** (Standard) · card/Paylink collection 6.5% (Standard) · insurance ~3%, min TT$15 · Tobago inter-island **+TT$30** ✅, so Tobago is **TT$90 all-in** (owner confirmed, 5 Oct 2026).
- **Stay on a Standard account and skip the bundles.** Corporate rates are TT$5 *higher* per delivery. Bundles are corporate-only, cost TT$33–37 per delivery (more than the TT$30 Standard urban rate), require TT$925+ up front and expire in 45 days. Corporate only pays off with lots of COD or card collection (0% vs 3%), and you're avoiding both.
- **Take payment before dispatch** (bank transfer). That avoids the 3% COD fee and failed deliveries where the customer refuses to pay.
- **Insurance:** skip it on decant orders (the TT$15 minimum is too high for a TT$100 parcel). Consider it for sealed bottles and pre-orders above ~TT$500 sent by ODeliver; pickup is better for bottles.

**What the customer pays:**

| Option | Customer pays | Notes |
|---|---|---|
| **Saturday pickup** at Price Plaza Chaguanas (10am), MovieTowne POS (1pm) or East Gates Mall (5pm) | **TT$0** | This is collection, not delivery. Push it: it costs you nothing, and you can upsell in person. Add a Wednesday stop later if volume justifies it |
| **Workplace hand-off** (your office, coworkers) | **TT$0** | Your easiest early customers. **Not shown on the website:** coworkers order on WhatsApp and you mark the order as workplace in admin. Cash is fine |
| **ODeliver (Trinidad)** | **ODeliver's rate at cost: TT$30 urban / 40 rural / 50 extended / 60 remote** | Pass the rate straight through, rounded up. Shown at checkout by area |
| **ODeliver Instant** (same day) | Distance rate + 5%, rounded up | Only on request |
| **Tobago** | **TT$90** via ODeliver (60 + 30 inter-island) or TTPost at cost | Prepaid only |

**Your own vehicle (owner's call, 5 Oct 2026): no separate drop-off option.**
- Customers always pay the **ODeliver rate** for their area.
- If you're already passing, you deliver it yourself and keep the fee. Example: after the Saturday-morning Chaguanas drop (before 8am) on the way back to San Juan, you can wait and hand off at M6 Plaza around 11am.
- **Public spots and businesses only, never home addresses.** Otherwise, book ODeliver.
- **Time and fuel are real costs.** Only do it when it's on your way.
- ⚠️ **Check your car insurance.** Many private policies exclude "carriage of goods for hire or reward", so a crash during a paid delivery could be uninsured. Ask your insurer; a small business-use endorsement is usually cheap.

## 8. Legal and admin in T&T

| Item | What to do | Cost | Status |
|---|---|---|---|
| **Business name registration** | Register as a sole trader with the Registrar General through TTBizLink (ID plus proof of address). Takes ~5–7 business days | ~TT$25 name reservation + ~TT$220 registration ✅ | Week 4 |
| **BIR file number / tax** | Business profit is added to your employment income and taxed at **25%** (30% above TT$1M chargeable income). You must file a return by **30 April** each year. Keep every receipt: Websource invoices, supplies, delivery, ads, a share of data costs | — | Confirm with an accountant |
| **VAT** | Registration is mandatory only above **TT$600,000** annual taxable supplies ⚠️. Not relevant for now. Below the threshold you can't reclaim import VAT | — | Revisit in Phase 3 |
| **Business levy / Green Fund levy** | Business levy (0.6%) only applies above ~TT$360k gross sales ⚠️. Check whether the Green Fund levy (0.3%) applies to sole traders ⚠️ | — | Confirm with an accountant |
| **Importing for resale** | You may need an importer/TTBizLink registration and a C82 entry (possibly through a broker) once Customs considers shipments commercial. **Declare full value with invoices, always** | Broker fees ⚠️ | Ask Customs/Websource (§3.5) |
| **Cosmetics rules** | Ask whether the **Chemistry, Food & Drugs Division** requires permits or registration for importing and selling fragrances, and whether **TTBS labeling standards** apply to repackaged decants ⚠️ | — | Confirm |
| **Trademarks / "dupes"** | Selling decants of genuine, legally bought perfume under its real name is common practice. Calling clones "inspired by" or "smells like" is comparative description. **Never** use brand logos, imitate packaging, or imply the clone *is* the original ⚠️ | — | A short consult with an IP lawyer is worthwhile before you scale |
| **Employment contract** | Check that your IT job allows side businesses and that there are no conflicts of interest | — | Do now |

**Get professional confirmation on:** the tax treatment and filing, the customs commercial-import process, the cosmetics permit question, and the dupe/trademark wording.

---

## 9. Risks and mitigations

| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| **Counterfeits in supply** | Medium / High | Buy only from authorized or reputable sellers, check batch codes, keep invoices, record unboxings. Never buy local "deals" for resale |
| **Websource won't fly perfume, or adds a hazmat fee** | Medium / High | **Confirm before ordering.** Get quotes from a backup skybox (e.g., Shopper's Express, Mailpac ⚠️). If it has to go by sea, add 2–3 weeks to the cash-flow timeline |
| **Shipping damage or leaks** | Low–Med / Med | Ask the seller for extra wrap, insure the shipment, photograph on arrival, file claims quickly |
| **Customs variability** (reassessment, commercial flag) | Medium / Med | Always declare full value. The plan's margins already assume full fees. Keep the ~US$100 reserve |
| **Exchange rate / card FX** | Low / Low–Med | Prices already include about 2% headroom. Review the price list quarterly |
| **Dead stock** | Medium / Med | With decants, a slow bottle still moves through curated sets and free 5ml decants. Follow the restock/retire rule (§3.3). Pre-orders only for anything above US$50 |
| **A sealed bottle doesn't sell** | Medium / Low | Hold it through Christmas. If it's still there in mid-January, decant it: that's worth ~TT$1,000 versus TT$425–599 sealed, so an unsold bottle is a better outcome, just slower cash |
| **Bottles undercut on price** | Medium / Low | Margins on sealed bottles are thin (8–41%). Don't chase a lower price; switch that scent to decants-only instead |
| **Price war (KmG and others cut prices)** | Medium / Med | Compete on bundles, curated sets, content and service, not a lower per-ml price. Your 50%+ margins leave room for a 10% promo when you need it |
| **Time crunch from the day job** | High / Med | Fixed weekly rhythm (§7.1). Batch decanting and filming. Your girlfriend covers women's content and the Saturday pickup |
| **Card not repaid from sales (conservative case)** | Medium / Low (you have a salary) | Pay in full from salary, treat it as a loan to the business, hold ad spend until it's repaid |

---

## 10. 12-month projection (Nov 2026 – Oct 2027)

Assumptions: ramp-up from launch, seasonality (Christmas, Carnival/Valentine's, Mother's and Father's Day), full bottles (sealed restocks at peaks plus pre-orders) rising from 10% to 40% of revenue, blended gross margin falling from ~51% to ~41%, no free delivery (customers pay delivery), ~1% of revenue for fuel on own-vehicle runs and payment fees, and monthly opex (ads, data, domain, misc) of TT$300 / 550 / 900. **Nov and Dec now include the 7 launch sealed bottles** at the 6 Oct prices (TT$3,397 revenue, ~TT$815 gross profit; was TT$3,599 / ~TT$1,017), split by when each scenario sells them (§2.7).

| Monthly revenue (TTD) | Nov | Dec | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | **Year** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Conservative | 2,899 | 4,648 | 1,990 | 2,750 | 1,690 | 1,930 | 2,790 | 3,100 | 2,460 | 2,750 | 2,740 | 3,200 | **32,947** |
| Expected | 5,398 | 5,399 | 3,740 | 5,320 | 3,360 | 3,910 | 5,750 | 6,480 | 5,220 | 5,890 | 5,940 | 7,000 | **63,407** |
| Optimistic | 7,197 | 7,270 | 5,820 | 8,450 | 5,430 | 6,400 | 9,510 | 10,820 | 8,790 | 9,980 | 10,130 | 12,000 | **101,797** |

| Scenario | Revenue | Net profit, pre-tax | After ~25% income tax | Orders/month at end (avg TT$150) |
|---|---|---|---|---|
| Conservative | TT$32.9k | **TT$10.4k** | ~TT$7.8k | ~21 |
| Expected | TT$63.4k | **TT$21.0k** | ~TT$15.8k | ~47 |
| Optimistic | TT$101.8k | **TT$33.7k** | ~TT$25.3k | ~80 |

**Milestones:**

| By | Milestone |
|---|---|
| Week 7 (5 Dec) | Card paid in full · 5+ of the 7 sealed bottles sold · 30+ orders · 10 reviews |
| Month 3 (Jan) | 40+ orders/month · 25% repeat · lineup at 15 scents · **Phase 2 trigger check** |
| Month 5 (Mar) | Website fully built out ("smells like" search plus SEO pages) · sealed-bottle restock for Valentine's and Mother's Day tested |
| Month 8 (Jun) | TT$6–8k/month · Father's Day gift sets · **Phase 3 trigger check** |
| Month 12 (Oct 2027) | TT$7k+/month (expected case) · price a wholesale supplier · decide whether to stay a side hustle or formalize |

Real-world caveat: these are planning assumptions, not forecasts. Within 6 weeks your actual week 3–8 numbers will show which row you're in. Re-baseline then.

---

## 11. First 30 days: prioritized checklist

*Status: ☐ open · ◐ in progress · ☑ done. Update as you go.*

**Must do before spending a cent**
1. ☑ **Websource:** flying perfume is confirmed from your own shipments and from local sellers who use them.
2. ☑ **Card:** statement closes on the 16th, payment due on the 5th. **Place the launch orders on or after Sat 17 Oct; they're due Sat 5 Dec.**
3. ☑ **Employment contract allows a side business.** Car insurance: your call, no action needed.

**Week 1**
4. ☑ **Name chosen: Smell Bess.** smellbess.com is available on Namecheap, and @smellbess is free on IG, TikTok, Facebook and WhatsApp.
    - ☐ **Buy smellbess.com now and claim @smellbess everywhere today**, before someone else does. Set up **WhatsApp Business** (catalog, quick replies, away message).
    - ☐ Start the website build (`website-brief.md`). The MVP should be live for the week 4 public launch.
5. ◐ **Launch buy locked** (§3.1, revised 5 Oct: 12 Jomashop bottles, 2 each of Liquid Brun, Hawas Ice, Hawas Diva, Angham, Pride Nebras, Musamam Black Intense, + 2 local Rayhaan Aquatica). Order on or after 17 Oct in **one Jomashop order with EXTRA20 + EXTRA10** (check both still work). Buy the 2 Rayhaans locally in week 3. **Upload invoices to Websource and ask them to keep the boxes on.**
    - ☐ Confirm the Pride Nebras sealed price (TT$425 ⚠️, the only one still unconfirmed; the owner set the other 6 on 6 Oct) against local listings.
    - ☐ Re-pick the scents for the Fete Pack, Date Night, Office/School and For Her sets (§2.3b).
6. ☐ Order decant supplies (glass atomizers 10ml/15ml/5ml, gift boxes for curated sets, syringes/pipettes, funnel, labels, zip bags, thank-you cards).
7. ☐ Choose 2–4 bottles from your own collection to decant (designer crowd-pleasers plus one women's).
8. ☐ Build the inventory/orders Google Sheet (bottles, ml left, orders, customers, referral credits).

**Week 2**
9. ◐ **Brand locked (§5a).** ☐ Print labels, seal stickers and insert cards from the brand pack; order matte black pouches.
10. ☐ Post 6–9 pre-launch posts. Start the WhatsApp broadcast list. Take pre-orders from coworkers and friends.
11. ☑ **Saturday pickup route set:** Price Plaza Chaguanas 10am, MovieTowne POS 1pm, East Gates Mall 5pm. No own-drop-off option: customers pay ODeliver rates, and you deliver yourself when you're passing (§7.4).
12. ☐ Open a separate bank account (or sub-account) for the business and the "card repayment" fund.

**Week 3**
13. ☐ Collect from Websource. **Verify authenticity** (batch codes, unboxing video). **Keep the Websource invoice** and rerun the landed costs, sealed profits and cash flow with the actual fees (§2.4a).
14. ☐ First decanting session. Fill pre-orders. First Saturday pickup.
15. ☐ Launch the curated sets, the 5×10ml TT$350 bundle and the 7 sealed bottles. Fill the week-2 bottle reservations first.

**Week 4**
16. ☐ **Register the business name** (TTBizLink, ~TT$245). Get a BIR file number.
17. ☐ Public launch post and first boosted reel (TT$150).
18. ☐ Turn on the referral code and stamp card.
19. ☐ Email/call Customs or a broker with the §3.5 questions. Book a 1-hour accountant consult.
20. ☐ Optional: send Fragrance Fanatics' 3ml/5ml vial prices and a few IG/TikTok sellers' prices (§4).

---

### Sources
- [TT Customs: duties and payment](http://www.customs.gov.tt/importing/duties-and-payment) · [Ministry of Finance: duties and taxes on online purchases (PDF)](https://www.finance.gov.tt/wp-content/uploads/2020/07/Press-Release-Calculation-of-Duties-and-Taxes-on-Online-Purchases-Final.pdf) · [RPM Express: TT customs duty and VAT](https://www.rpmexpresscouriers.com/customs)
- [KmG Scents (Take App)](https://take.app/kmgscents) · [SA Exclusive fragrances](https://saexclusivett.com/product-category/fragrances/) · [Fragrance Fanatics T&T](https://fragrancefanaticstt.com/) · [Facebook Marketplace fragrances, San Fernando](https://www.facebook.com/marketplace/103769882995046/fragrances/) · [TikTok: Lattafa perfumes Trinidad](https://www.tiktok.com/discover/lattafa-perfumes-trinidad)
- [Jomashop: Lattafa Khamrah](https://www.jomashop.com/lattafa-unisex-khamrah-edp-spray-3-4-oz-fragrances-6291108737194.html) · [Jomashop: Lattafa range](https://www.jomashop.com/collections/fragrances/Lattafa-Fragrances-&-Perfumes~bWFudWZhY3R1cmVyfkxhdHRhZmE) · [FragFlex](https://shop.app/m/fragflex)
- [ODeliver: pricing](https://odeliver.org/pricing#standard-pricing) · [ODeliver: hub & spoke](https://odeliver.org/business/standard-delivery) · [ODeliver: instant](https://odeliver.org/business/instant-delivery) · [ODeliver: bundles](https://www.odeliver.net/products/bundles) · [ODeliver: FAQ](https://odeliver.org/faq)
- [Take App pricing](https://www.take.app/pricing)
- [Uprank: cost to register a business in Trinidad](https://uprank.co.tt/cost-register-business-trinidad/) · [Deel: sole proprietorship in TT](https://www.deel.com/blog/sole-proprietorship-trinidad-and-tobago/) · [TTBizLink: Registration of Business Names Act](https://www.ttbizlink.gov.tt/trade/tnt/cmn/pdf/Registration%20of%20Business%20Names%20Act-82.85.pdf)
