import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    service: "oiltrade-india",
    status: "ok",
    mode: process.env.NEXT_PUBLIC_DEMO_MODE === "false" ? "production-configured" : "demo",
    at: new Date().toISOString()
  });
}
