import { assertOrderTransition, calculateCommission, createCommissionEntry } from "./commerce";
import { demoCatalog } from "./demo-catalog";

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
  paymentStatus: "PENDING" | "CAPTURED";
  productSubtotalPaise: number;
  deliveryChargePaise: number;
  taxPaise: number;
  totalPayablePaise: number;
  commissionRateBps: number;
  commissionBasis: string;
  commissionPaise: number;
  sellerProceedsPaise: number;
  productName: string;
  quantityKg: number;
  events: Array<{ from: string; to: string; at: string; actorId: string }>;
};

type Store = { rfqs: DemoRfq[]; orders: Map<string, DemoOrder>; idempotency: Set<string>; ledger: unknown[] };
const getStore = (): Store => {
  const globalStore = globalThis as typeof globalThis & { oiltradeDemoStore?: Store };
  if (!globalStore.oiltradeDemoStore) {
    globalStore.oiltradeDemoStore = {
      rfqs: [], idempotency: new Set(), ledger: [],
      orders: new Map([["OT-2026-0418", { publicId: "OT-2026-0418", buyerCompanyId: "demo-buyer-company", sellerCompanyId: "demo-seller-company", status: "PAYMENT_CONFIRMED", paymentStatus: "CAPTURED", productSubtotalPaise: 64_250_000, deliveryChargePaise: 0, taxPaise: 0, totalPayablePaise: 64_250_000, commissionRateBps: 100, commissionBasis: "PRODUCT_VALUE", commissionPaise: 642_500, sellerProceedsPaise: 63_607_500, productName: "Refined Sunflower Oil", quantityKg: 5000, events: [] }]])
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

export function createDemoOrder(input: { buyerCompanyId: string; productId: number; quantityKg: number; idempotencyKey: string }) {
  const store = getStore();
  const product = demoCatalog.get(input.productId);
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  if (!Number.isSafeInteger(input.quantityKg) || input.quantityKg < product.minimumOrderKg) throw new Error(`Minimum order is ${product.minimumOrderKg} kg`);
  const existing = [...store.orders.values()].find((order) => (order as DemoOrder & { idempotencyKey?: string }).idempotencyKey === input.idempotencyKey);
  if (existing) return existing;
  const productSubtotalPaise = product.pricePaisePerKg * input.quantityKg;
  const commission = calculateCommission({ productSubtotalPaise });
  const number = String(store.orders.size + 419).padStart(4, "0");
  const order = { publicId: `OT-2026-${number}`, buyerCompanyId: input.buyerCompanyId, sellerCompanyId: product.sellerCompanyId, status: "PAYMENT_PENDING", paymentStatus: "PENDING" as const, productSubtotalPaise, deliveryChargePaise: 0, taxPaise: 0, totalPayablePaise: productSubtotalPaise, commissionRateBps: commission.rateBps, commissionBasis: commission.basis, commissionPaise: commission.commissionPaise, sellerProceedsPaise: commission.sellerProceedsPaise, productName: product.name, quantityKg: input.quantityKg, idempotencyKey: input.idempotencyKey, events: [{ from: "DRAFT", to: "PAYMENT_PENDING", at: new Date().toISOString(), actorId: "system" }] };
  store.orders.set(order.publicId, order);
  return order;
}

export function getDemoOrder(publicId: string, companyId: string) {
  const order = getStore().orders.get(publicId);
  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (![order.buyerCompanyId, order.sellerCompanyId].includes(companyId)) throw new Error("FORBIDDEN_ORDER_ACCESS");
  return order;
}

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
