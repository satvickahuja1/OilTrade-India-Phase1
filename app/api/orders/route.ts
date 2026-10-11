import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireDemoSession } from "../../../lib/demo-auth";
import { createDemoOrder } from "../../../lib/demo-store";

export async function POST(request: NextRequest) {
  try {
    const session = requireDemoSession(request, ["BUYER"]);
    const body = await request.json();
    const key = request.headers.get("idempotency-key");
    if (!key || key.length > 128 || typeof body?.productId !== "number" || !Number.isSafeInteger(body?.quantityKg)) return NextResponse.json({ error: "productId, integer quantityKg and Idempotency-Key are required" }, { status: 400 });
    const record = createDemoOrder({ buyerCompanyId: session.companyId, productId: body.productId, quantityKg: body.quantityKg, idempotencyKey: key });
    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INVALID_ORDER";
    if (["FORBIDDEN", "AUTH_PROVIDER_REQUIRED", "INVALID_DEMO_ROLE"].includes(code)) return authErrorResponse(error);
    return NextResponse.json({ error: code }, { status: 422 });
  }
}
