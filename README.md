# OilTrade India — Phase 1 Marketplace

A polished, runnable Next.js demonstration of an India-focused B2B oil raw-material marketplace. It is deliberately labelled as **demo mode**: sample records are local UI data and no funds, verification, notifications or documents are sent to external systems.

## Included workflows

- Responsive buyer procurement workspace with seeded industrial oil and meal listings
- Product discovery, search, category and supplier-verification filtering
- Product details with MOQ, indicative pricing and quotation/order intent paths
- Three-step RFQ draft flow, private RFQ positioning and quotation summary table
- Order tracking timeline and safeguarded invoice/document states
- Seller listing-management preview with review state separation
- Financial reporting view that distinguishes GMV, 1% commission and seller proceeds
- Business-verification checklist with intentional document-access messaging

## Run locally

```bash
npm install --cache .npm-cache
npm run dev
```

Open the URL shown by Next.js (typically `http://localhost:3000`). For production verification:

```bash
npm run build
```

## Production architecture next steps

The UI establishes the Phase 1 interactions and data contracts. Before handling real commerce, add PostgreSQL + Prisma migrations, trusted authentication and server-side RBAC; then build server-validated product/RFQ/order state transitions, private object storage, webhook idempotency, integer-paise financial ledgers, and an approved marketplace payment/settlement provider. Keep provider credentials and business configuration environment-based.
