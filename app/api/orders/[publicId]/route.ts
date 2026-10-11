import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireDemoSession } from "../../../../lib/demo-auth";
import { getDemoOrder } from "../../../../lib/demo-store";

export async function GET(request: NextRequest, { params }: { params: Promise<{ publicId: string }> }) {
  try { const session = requireDemoSession(request, ["BUYER", "SELLER", "ADMIN", "FINANCE_OPS"]); const { publicId } = await params; return NextResponse.json({ record: getDemoOrder(publicId, session.companyId) }); }
  catch (error) { const code = error instanceof Error ? error.message : "INVALID_REQUEST"; if (["FORBIDDEN", "AUTH_PROVIDER_REQUIRED", "INVALID_DEMO_ROLE"].includes(code)) return authErrorResponse(error); return NextResponse.json({ error: code === "ORDER_NOT_FOUND" ? "Order not found" : "You do not have access to this order" }, { status: code === "ORDER_NOT_FOUND" ? 404 : 403 }); }
}
