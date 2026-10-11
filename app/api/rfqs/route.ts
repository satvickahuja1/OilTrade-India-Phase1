import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireDemoSession } from "../../../lib/demo-auth";
import { createDemoRfq, listDemoRfqs } from "../../../lib/demo-store";

type RfqInput = { materialName?: unknown; category?: unknown; quantity?: unknown; unit?: unknown; specifications?: unknown; deliveryLocation?: unknown; requiredBy?: unknown };

function parseRfq(input: RfqInput) {
  const text = (value: unknown, field: string, max: number, required = true) => {
    if (typeof value !== "string" || (required && !value.trim()) || value.length > max) throw new Error(`Invalid ${field}`);
    return value.trim();
  };
  if (!Number.isFinite(input.quantity) || !Number.isSafeInteger(input.quantity) || (input.quantity as number) <= 0) throw new Error("Invalid quantity");
  return {
    materialName: text(input.materialName, "material name", 140), category: text(input.category, "category", 80), quantity: input.quantity as number,
    unit: text(input.unit, "unit", 24), specifications: typeof input.specifications === "string" ? text(input.specifications, "specifications", 3000, false) : undefined,
    deliveryLocation: text(input.deliveryLocation, "delivery location", 240), requiredBy: typeof input.requiredBy === "string" && /^\d{4}-\d{2}-\d{2}$/.test(input.requiredBy) ? input.requiredBy : undefined
  };
}

export function GET(request: NextRequest) {
  try { const session = requireDemoSession(request, ["BUYER", "ADMIN"]); return NextResponse.json({ records: listDemoRfqs(session.companyId) }); }
  catch (error) { return authErrorResponse(error); }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireDemoSession(request, ["BUYER"]);
    const input = parseRfq(await request.json());
    return NextResponse.json({ record: createDemoRfq({ ...input, buyerCompanyId: session.companyId }) }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && /^(FORBIDDEN|AUTH_PROVIDER_REQUIRED|INVALID_DEMO_ROLE)$/.test(error.message)) return authErrorResponse(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid RFQ request" }, { status: 422 });
  }
}
