import test from "node:test";
import assert from "node:assert/strict";
import { assertOrderTransition, calculateCommission, calculateRefundCommission, createCommissionEntry } from "../lib/commerce.js";

test("commission is calculated in integer paise at 1%", () => {
  assert.deepEqual(calculateCommission({ productSubtotalPaise: 10_000_000 }), {
    basis: "PRODUCT_VALUE", rateBps: 100, commissionPaise: 100_000, sellerProceedsPaise: 9_900_000
  });
});

test("commission is rounded to the nearest paise", () => {
  assert.equal(calculateCommission({ productSubtotalPaise: 151, rateBps: 100 }).commissionPaise, 2);
});

test("partial refunds reverse commission proportionately", () => {
  assert.equal(calculateRefundCommission({ originalCommissionPaise: 100_000, originalProductSubtotalPaise: 10_000_000, refundProductValuePaise: 2_500_000 }), 25_000);
});

test("only declared lifecycle transitions are allowed", () => {
  assert.equal(assertOrderTransition("PAYMENT_PENDING", "PAYMENT_CONFIRMED"), true);
  assert.throws(() => assertOrderTransition("DRAFT", "SHIPPED"), /Invalid order transition/);
});

test("commission ledger keys make retries idempotent", () => {
  assert.equal(createCommissionEntry({ orderId: "ord_1", eventId: "evt_1", amountPaise: 100 }).idempotencyKey, "commission:ord_1:evt_1");
});
