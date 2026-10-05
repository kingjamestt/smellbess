# smellbess.com (web)

Storefront for Smell Bess. Next.js 16 (App Router) + TypeScript + Tailwind v4. Plan, data model and open questions: [`../docs/website-plan.md`](../docs/website-plan.md).

## Run locally

Needs Node 20.9+ (built on Node 24).

```bash
cd web
npm install
cp .env.example .env.local   # then put the real bank details in .env.local (never commit it)
npm run dev                  # http://localhost:3000
```

Other commands:

```bash
npm test          # unit tests (Vitest)
npm run lint      # ESLint
npm run build     # production build
npm start         # serve the production build
```

## Where things live

| Path | What |
|---|---|
| `src/lib/pricing.ts` | Tier price table (TTD). The only place decant prices exist |
| `src/lib/offers.ts` | Offers engine: bundle, curated sets, free 5ml; exactly one per order |
| `src/lib/stock.ts` | ml-based stock, size availability, low-stock badges, 15ml fallback |
| `src/lib/delivery.ts` | Pickup / workplace / own drop-off / ODeliver zone fees; payment options |
| `src/lib/checkout.ts` | Server-side order validation and building |
| `src/lib/whatsapp.ts` | Pre-filled WhatsApp order message |
| `src/lib/pipeline.ts` | Order status transitions and the decanting list (admin, M2) |
| `src/lib/data/` | Data-access layer. `Repository` interface + JSON-file implementation |
| `src/data/seed.ts` | Catalog seed from `scent-lists.md` (all copy is DRAFT) |
| `src/config/site.ts` | WhatsApp number, pickup stops, own drop-off areas, legal copy |

## Data

No cloud services needed. On first run the app creates `web/.data/store.json` (gitignored) from the seed: bottles, delivery areas, settings and orders. Delete it to reset. The seed ships **demo bottles** for the 10 launch scents so the shop can be clicked through; replace them with the real bottles when they arrive.

To move to Supabase later, write a `SupabaseRepository` that implements `src/lib/data/repository.ts` and return it from `getRepository()` in `src/lib/data/index.ts`. Nothing else changes.

## Bank details

Read only from server env vars (`SMELLBESS_BANK_1_...`, `SMELLBESS_BANK_2_...`; see `.env.example`). They are shown on the order confirmation page for bank-transfer orders. Never put them in code, seed data, docs or tests.
