export const DEFAULT_COMMISSION_BPS: number;
export const allowedTransitions: Readonly<Record<string, string[]>>;
export function assertOrderTransition(from: string, to: string): true;
export function calculateCommission(input: {
  productSubtotalPaise: number;
  rateBps?: number;
  basis?: "PRODUCT_VALUE";
}): { basis: string; rateBps: number; commissionPaise: number; sellerProceedsPaise: number };
export function calculateRefundCommission(input: {
  originalCommissionPaise: number;
  originalProductSubtotalPaise: number;
  refundProductValuePaise: number;
}): number;
export function createCommissionEntry(input: {
  orderId: string;
  eventId: string;
  amountPaise: number;
  kind?: string;
}): { orderId: string; kind: string; amountPaise: number; status: string; idempotencyKey: string };
