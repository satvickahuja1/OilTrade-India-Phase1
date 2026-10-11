/**
 * Financial primitives use integer paise exclusively. They have no database
 * dependency, which keeps order creation and webhook processing testable.
 */
export const DEFAULT_COMMISSION_BPS = 100;

export const allowedTransitions = Object.freeze({
  DRAFT: ["QUOTATION_ACCEPTED", "CANCELLED"],
  QUOTATION_ACCEPTED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PAYMENT_PENDING", "CANCELLED"],
  PAYMENT_PENDING: ["PAYMENT_CONFIRMED", "FAILED", "CANCELLED"],
  PAYMENT_CONFIRMED: ["PROCESSING", "REFUNDED", "DISPUTED"],
  PROCESSING: ["SHIPPED", "CANCELLED", "DISPUTED"],
  SHIPPED: ["DELIVERED", "DISPUTED"],
  DELIVERED: ["COMPLETED", "DISPUTED", "REFUNDED"],
  COMPLETED: ["REFUNDED", "DISPUTED"],
  CANCELLED: [], REFUNDED: [], DISPUTED: [], FAILED: []
});

export function assertOrderTransition(from, to) {
  if (!allowedTransitions[from]?.includes(to)) {
    throw new Error(`Invalid order transition: ${from} → ${to}`);
  }
  return true;
}

export function calculateCommission({ productSubtotalPaise, rateBps = DEFAULT_COMMISSION_BPS, basis = "PRODUCT_VALUE" }) {
  if (!Number.isSafeInteger(productSubtotalPaise) || productSubtotalPaise < 0) throw new Error("productSubtotalPaise must be a non-negative integer");
  if (!Number.isInteger(rateBps) || rateBps < 0 || rateBps > 10000) throw new Error("rateBps must be an integer between 0 and 10000");
  if (basis !== "PRODUCT_VALUE") throw new Error(`Unsupported commission basis: ${basis}`);
  // Round half up to the nearest paise. Store the rate and basis on the order.
  const commissionPaise = Math.floor((productSubtotalPaise * rateBps + 5000) / 10000);
  return { basis, rateBps, commissionPaise, sellerProceedsPaise: productSubtotalPaise - commissionPaise };
}

export function calculateRefundCommission({ originalCommissionPaise, originalProductSubtotalPaise, refundProductValuePaise }) {
  if (![originalCommissionPaise, originalProductSubtotalPaise, refundProductValuePaise].every(Number.isSafeInteger)) throw new Error("Refund values must be integer paise");
  if (originalProductSubtotalPaise <= 0 || refundProductValuePaise < 0 || refundProductValuePaise > originalProductSubtotalPaise) throw new Error("Invalid refund amount");
  return Math.floor((originalCommissionPaise * refundProductValuePaise + Math.floor(originalProductSubtotalPaise / 2)) / originalProductSubtotalPaise);
}

export function createCommissionEntry({ orderId, eventId, amountPaise, kind = "COMMISSION_ACCRUAL" }) {
  if (!orderId || !eventId) throw new Error("orderId and eventId are required for idempotency");
  return { orderId, kind, amountPaise, status: "PENDING", idempotencyKey: `commission:${orderId}:${eventId}` };
}
