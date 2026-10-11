# OilTrade India — Phase 1 Marketplace

A polished, runnable Next.js demonstration of an India-focused B2B oil raw-material marketplace. It is deliberately labelled as **demo mode**: sample records are local UI data and no funds, verification, notifications or documents are sent to external systems.

## Included workflows

- Responsive buyer procurement workspace with seeded industrial oil and meal listings
- Clickable buyer/seller workspace switcher with seller dashboard, seller-specific navigation and browser-persisted demo selection
- Product discovery, search, category and supplier-verification filtering
- Product details with MOQ, indicative pricing and quotation/order intent paths
- Three-step RFQ draft flow, private RFQ positioning and quotation summary table
- Order tracking timeline and safeguarded invoice/document states
- Seller listing-management preview with review state separation
- Financial reporting view that distinguishes GMV, 1% commission and seller proceeds
- Business-verification checklist with intentional document-access messaging
- PostgreSQL/Prisma production data model for companies, memberships, documents, catalogues, RFQs, quotations, orders, payments, commission ledger, settlements, notifications and audit logs
- Server health endpoint plus a server-side commission-preview endpoint (`POST /api/commission/preview`)
- Demo-mode RFQ API with server-side validation, plus an order-transition API that enforces lifecycle rules and company ownership
- Server-created fixed-price demo checkout: browser prices are ignored, MOQ is validated against the server catalogue, and each payment-pending order stores an immutable commission-rate/basis snapshot
- Unit tests for paise rounding, refund reversal, state-machine guards and commission idempotency keys

## Run locally

```bash
npm install --cache .npm-cache
npm run dev
```

Open the URL shown by Next.js (typically `http://localhost:3000`). For production verification:

```bash
npm run build
npm test
npm run prisma:validate
```

For a local PostgreSQL instance, copy `.env.example` to `.env` and run `docker compose up -d`. Then use Prisma migration commands once the `prisma` development dependency has been installed.

## Demo API behavior

`POST /api/rfqs` is live in demo mode and is used by the RFQ modal. Demo data is process-local and intentionally ephemeral. The `x-oiltrade-demo-role` header is accepted only while demo mode is enabled; setting `NEXT_PUBLIC_DEMO_MODE=false` makes these routes fail closed until a real server-side authentication provider is connected.

## Production architecture next steps

The UI establishes the Phase 1 interactions and data contracts. Before handling real commerce, add PostgreSQL + Prisma migrations, trusted authentication and server-side RBAC; then build server-validated product/RFQ/order state transitions, private object storage, webhook idempotency, integer-paise financial ledgers, and an approved marketplace payment/settlement provider. Keep provider credentials and business configuration environment-based.
