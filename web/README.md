# Smell Bess website (web)

Storefront for Smell Bess. Next.js 16 (App Router) + TypeScript + Tailwind v4. Plan, data model and open questions: [`../docs/website-plan.md`](../docs/website-plan.md).

## Run locally

Needs Node 24 (see `.nvmrc`; `nvm use` picks it up). Run `npm install` with the same Node you test with: Vitest's native bindings break if `node_modules` was installed under another version.

```bash
cd web
npm install
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
| `src/lib/offers.ts` | Offers engine: repeatable 5×10ml bundle, curated sets, free 5ml surprise; exactly one per order |
| `src/lib/stock.ts` | ml-based stock, size availability, low-stock badges, 15ml fallback |
| `src/lib/delivery.ts` | Saturday pickup, ODeliver zone fees, workplace (admin only); payment options |
| `src/lib/checkout.ts` | Server-side order validation and building |
| `src/lib/whatsapp.ts` | Pre-filled WhatsApp order message |
| `src/lib/pipeline.ts` | Order status transitions and the decanting list (admin, M2) |
| `src/lib/data/` | Data-access layer. `Repository` interface + JSON-file implementation |
| `src/data/seed.ts` | Catalog seed from `scent-lists.md` (all copy is DRAFT) |
| `src/config/site.ts` | WhatsApp number, pickup stops, legal copy |

## Data

No cloud services needed. On first run the app creates `web/.data/store.json` (gitignored) from the seed: bottles, delivery areas, settings and orders. Delete it to reset. The seed ships **demo bottles** for the launch scents so the shop can be clicked through; replace them with the real bottles when they arrive. Amber Oud Gold (50ml) and Marwa (80ml) are the owner's real bottles.

To move to Supabase later, write a `SupabaseRepository` that implements `src/lib/data/repository.ts` and return it from `getRepository()` in `src/lib/data/index.ts`. Nothing else changes.

## Bank details

Not on the site at all. The customer sends the order on WhatsApp and we reply there with payment details. Never put bank details in code, seed data, docs, tests or env vars.
