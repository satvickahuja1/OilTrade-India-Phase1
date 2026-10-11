import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireDemoSession } from "../../../../../lib/demo-auth";
import { transitionDemoOrder } from "../../../../../lib/demo-store";

export async function POST(request: NextRequest, { params }: { params: Promise<{ publicId: string }> }) {
  try {
    const session = requireDemoSession(request, ["BUYER", "SELLER", "ADMIN"]);
    const body = await request.json();
    if (typeof body?.to !== "string" || typeof body?.eventId !== "string" || body.eventId.length > 128) return NextResponse.json({ error: "to and eventId are required" }, { status: 400 });
    const { publicId } = await params;
    return NextResponse.json({ record: transitionDemoOrder({ publicId, to: body.to, eventId: body.eventId, actorId: session.userId, actorCompanyId: session.companyId }) });
  } catch (error) {
    const code = error instanceof Error ? error.message : "INVALID_REQUEST";
    if (["FORBIDDEN", "AUTH_PROVIDER_REQUIRED", "INVALID_DEMO_ROLE"].includes(code)) return authErrorResponse(error);
    if (code === "ORDER_NOT_FOUND") return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (code === "FORBIDDEN_ORDER_ACCESS") return NextResponse.json({ error: "You do not have access to this order" }, { status: 403 });
    return NextResponse.json({ error: code }, { status: 422 });
  }
}
