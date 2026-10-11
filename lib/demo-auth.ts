import { NextRequest } from "next/server";

export type DemoRole = "BUYER" | "SELLER" | "ADMIN" | "FINANCE_OPS";

export type DemoSession = {
  userId: string;
  companyId: string;
  role: DemoRole;
};

const roles = new Set<DemoRole>(["BUYER", "SELLER", "ADMIN", "FINANCE_OPS"]);

/**
 * This intentionally supports a header-selected session only in demo mode.
 * A deployment with NEXT_PUBLIC_DEMO_MODE=false must replace this with a
 * verified server session from the chosen authentication provider.
 */
export function requireDemoSession(request: NextRequest, allowedRoles: DemoRole[]): DemoSession {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "false") {
    throw new Error("AUTH_PROVIDER_REQUIRED");
  }
  const requestedRole = request.headers.get("x-oiltrade-demo-role") ?? "BUYER";
  if (!roles.has(requestedRole as DemoRole)) throw new Error("INVALID_DEMO_ROLE");
  const role = requestedRole as DemoRole;
  if (!allowedRoles.includes(role)) throw new Error("FORBIDDEN");
  return {
    role,
    userId: `demo-${role.toLowerCase()}-user`,
    companyId: `demo-${role.toLowerCase()}-company`
  };
}

export function authErrorResponse(error: unknown) {
  const code = error instanceof Error ? error.message : "UNAUTHORIZED";
  const status = code === "FORBIDDEN" ? 403 : code === "AUTH_PROVIDER_REQUIRED" ? 503 : 401;
  return Response.json({ error: code === "AUTH_PROVIDER_REQUIRED" ? "An authenticated production session is required." : "Unauthorised request." }, { status });
}
