import { assertOrderTransition, createCommissionEntry } from "./commerce";

export type DemoRfq = {
  id: string;
  buyerCompanyId: string;
  materialName: string;
  category: string;
  quantity: number;
  unit: string;
  specifications?: string;
  deliveryLocation: string;
  requiredBy?: string;
  status: "DRAFT";
  createdAt: string;
};

export type DemoOrder = {
  publicId: string;
  buyerCompanyId: string;
  sellerCompanyId: string;
  status: string;
  events: Array<{ from: string; to: string; at: string; actorId: string }>;
};

type Store = { rfqs: DemoRfq[]; orders: Map<string, DemoOrder>; idempotency: Set<string>; ledger: unknown[] };
const getStore = (): Store => {
  const globalStore = globalThis as typeof globalThis & { oiltradeDemoStore?: Store };
  if (!globalStore.oiltradeDemoStore) {
    globalStore.oiltradeDemoStore = {
      rfqs: [], idempotency: new Set(), ledger: [],
      orders: new Map([["OT-2026-0418", { publicId: "OT-2026-0418", buyerCompanyId: "demo-buyer-company", sellerCompanyId: "demo-seller-company", status: "PAYMENT_CONFIRMED", events: [] }]])
    };
  }
  return globalStore.oiltradeDemoStore;
};

export function createDemoRfq(input: Omit<DemoRfq, "id" | "status" | "createdAt">) {
  const record: DemoRfq = { ...input, id: `RFQ-DEMO-${String(getStore().rfqs.length + 113).padStart(3, "0")}`, status: "DRAFT", createdAt: new Date().toISOString() };
  getStore().rfqs.unshift(record);
  return record;
}

export function listDemoRfqs(companyId: string) { return getStore().rfqs.filter((rfq) => rfq.buyerCompanyId === companyId); }

export function transitionDemoOrder(input: { publicId: string; actorId: string; actorCompanyId: string; to: string; eventId: string }) {
  const store = getStore();
  const order = store.orders.get(input.publicId);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (![order.buyerCompanyId, order.sellerCompanyId].includes(input.actorCompanyId)) throw new Error("FORBIDDEN_ORDER_ACCESS");
  assertOrderTransition(order.status, input.to);
  const previous = order.status;
  order.status = input.to;
  order.events.push({ from: previous, to: input.to, at: new Date().toISOString(), actorId: input.actorId });
  // In the real repository layer this becomes a single DB transaction with a unique idempotency key.
  if (input.to === "COMPLETED") {
    const entry = createCommissionEntry({ orderId: input.publicId, eventId: input.eventId, amountPaise: 642500 });
    if (!store.idempotency.has(entry.idempotencyKey)) { store.idempotency.add(entry.idempotencyKey); store.ledger.push(entry); }
  }
  return order;
}
