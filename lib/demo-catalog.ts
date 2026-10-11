/** Server-owned demo catalogue. Checkout never accepts price from the browser. */
export const demoCatalog = new Map([
  [1, { id: 1, name: "Refined Sunflower Oil", sellerCompanyId: "demo-seller-company", pricePaisePerKg: 12850, unit: "kg", minimumOrderKg: 5000 }],
  [2, { id: 2, name: "Crude Palm Oil", sellerCompanyId: "demo-seller-company", pricePaisePerKg: 9620, unit: "kg", minimumOrderKg: 20000 }],
  [3, { id: 3, name: "Mustard Oil Cake", sellerCompanyId: "demo-seller-company", pricePaisePerKg: 2480, unit: "kg", minimumOrderKg: 10000 }],
  [4, { id: 4, name: "Cold Pressed Groundnut Oil", sellerCompanyId: "demo-seller-company", pricePaisePerKg: 18200, unit: "litre", minimumOrderKg: 1000 }],
  [5, { id: 5, name: "De-oiled Rice Bran", sellerCompanyId: "demo-seller-company", pricePaisePerKg: 1950, unit: "kg", minimumOrderKg: 15000 }],
  [6, { id: 6, name: "Castor Oil, First Pressed", sellerCompanyId: "demo-seller-company", pricePaisePerKg: 15400, unit: "kg", minimumOrderKg: 2000 }]
]);
