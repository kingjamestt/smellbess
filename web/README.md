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
| `src/lib/pipeline.ts` | Order status transitions and the decanting list |
| `src/lib/admin-ops.ts` | Admin operations (each checks the login first) |
| `src/lib/auth.ts` | Admin login (Supabase Auth + email allowlist) |
| `src/lib/data/` | Data-access layer: `Repository` interface, JSON-file and Supabase implementations |
| `src/data/seed.ts` | Catalog seed from `scent-lists.md` (all copy is DRAFT) |
| `src/config/site.ts` | WhatsApp number, pickup stops, legal copy |

## Data

Two backends behind one interface (`src/lib/data/repository.ts`), picked in `src/lib/data/index.ts`:

- **Supabase** when `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are set. Production always uses this (it refuses to start on the JSON file).
- **JSON file** otherwise: `web/.data/store.json` (gitignored), created from the seed with **demo bottles** so the shop can be clicked through. Delete it to reset.

### Supabase

- Project `smellbess` (ref `kdchdpgxgflysuzqodzu`, us-east-1), org "BS Web", free plan.
- Schema: `supabase/migrations/`. RLS is on for every table with **no policies**, so the publishable key can't read or write anything. Only the server touches data, with the secret key.
- Orders are saved by the `place_order` function. It re-checks stock under a lock, so two customers can't both claim the last 10ml. `transition_order` moves an order's status and, on "decanted", takes the ml out of the bottles in the same step.
- Catalog seed: `node scripts/seed-sql.mts > seed.sql`, then run it in the SQL editor. It upserts products and sets, and never overwrites settings or bottles the admins changed.

## Admin (`/admin`)

- **Login:** email magic link (Supabase Auth). Only emails in `SMELLBESS_ADMIN_EMAILS` get in. Every admin page and action checks the session (`requireAdmin`); `src/proxy.ts` only keeps the session fresh. Open the link in the same browser you requested it from.
- **Orders:** status pipeline, pick the free 5ml, cancel, WhatsApp the customer, CSV export (`/admin/export`).
- **+ Order:** WhatsApp and workplace orders, with the same pricing, offers and stock rules as the shop.
- **Decanting** list, **Stock** (bottles, ml, atomizer flags), **Pickup** run editor, **Zones** editor.
- **New-order emails** go to the admin emails through Resend when `RESEND_API_KEY` is set.
- **Local admin without Supabase:** set `SMELLBESS_DEV_ADMIN=1` and leave the Supabase vars empty. Never works in production.

## Environment variables

See `.env.example`. On Netlify, set them under Site configuration → Environment variables. `SUPABASE_SECRET_KEY` and `RESEND_API_KEY` are secrets. Never give them a `NEXT_PUBLIC_` prefix.

## Bank details

Not on the site at all. The customer sends the order on WhatsApp and we reply there with payment details. Never put bank details in code, seed data, docs, tests or env vars.
