export type Product = {
  id: number; name: string; category: string; seller: string; location: string; price: number;
  unit: string; minOrder: string; stock: string; grade: string; verified: boolean; lead: string; tone: string;
};

export const products: Product[] = [
  { id: 1, name: "Refined Sunflower Oil", category: "Edible oils", seller: "Aster Agro Oils", location: "Indore, MP", price: 128.5, unit: "kg", minOrder: "5 MT", stock: "120 MT available", grade: "RBD • Food grade", verified: true, lead: "3–5 days", tone: "sunflower" },
  { id: 2, name: "Crude Palm Oil", category: "Crude vegetable oils", seller: "Kaveri Commodities", location: "Kandla, Gujarat", price: 96.2, unit: "kg", minOrder: "20 MT", stock: "450 MT available", grade: "CPO • FFA ≤ 5%", verified: true, lead: "2–4 days", tone: "palm" },
  { id: 3, name: "Mustard Oil Cake", category: "Oil cakes & meals", seller: "Rajasthan Agri Foods", location: "Jaipur, Rajasthan", price: 24.8, unit: "kg", minOrder: "10 MT", stock: "70 MT available", grade: "High protein • Feed grade", verified: true, lead: "4–6 days", tone: "mustard" },
  { id: 4, name: "Cold Pressed Groundnut Oil", category: "Edible oils", seller: "Saffron Valley Foods", location: "Rajkot, Gujarat", price: 182, unit: "litre", minOrder: "1 MT", stock: "Request availability", grade: "Unrefined • Premium", verified: true, lead: "5–7 days", tone: "groundnut" },
  { id: 5, name: "De-oiled Rice Bran", category: "Oil cakes & meals", seller: "Eastern Grain Works", location: "Bardhaman, WB", price: 19.5, unit: "kg", minOrder: "15 MT", stock: "200 MT available", grade: "Extraction meal", verified: false, lead: "6–8 days", tone: "bran" },
  { id: 6, name: "Castor Oil, First Pressed", category: "Industrial oils", seller: "Vardan Chemicals", location: "Palanpur, Gujarat", price: 154, unit: "kg", minOrder: "2 MT", stock: "35 MT available", grade: "Industrial • Grade 1", verified: true, lead: "4–6 days", tone: "castor" }
];

export const formatInr = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const dashboardOrders = [
  { id: "OT-2026-0418", supplier: "Aster Agro Oils", product: "Refined Sunflower Oil", amount: 642500, status: "Processing", date: "10 Oct 2026" },
  { id: "OT-2026-0406", supplier: "Vardan Chemicals", product: "Castor Oil, First Pressed", amount: 308000, status: "Shipped", date: "07 Oct 2026" },
  { id: "OT-2026-0389", supplier: "Rajasthan Agri Foods", product: "Mustard Oil Cake", amount: 496000, status: "Delivered", date: "29 Sep 2026" }
];
