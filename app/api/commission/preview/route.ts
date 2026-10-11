import { NextRequest, NextResponse } from "next/server";
import { calculateCommission } from "../../../../lib/commerce";

export async function POST(request: NextRequest) {
  const input = await request.json().catch(() => null);
  if (!input || !Number.isSafeInteger(input.productSubtotalPaise)) {
    return NextResponse.json({ error: "productSubtotalPaise must be supplied as integer paise." }, { status: 400 });
  }
  try {
    const rateBps = Number.isInteger(input.rateBps) ? input.rateBps : Number(process.env.PLATFORM_COMMISSION_BPS || 100);
    return NextResponse.json(calculateCommission({ productSubtotalPaise: input.productSubtotalPaise, rateBps }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid commission request" }, { status: 422 });
  }
}
