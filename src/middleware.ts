import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

// ============================================================
// Next.js Middleware — Admin Route Protection
// ============================================================
//
// IMPORTANT: This middleware runs in the Node.js runtime (not Edge)
// because it uses `jsonwebtoken` which depends on Node.js `crypto`.
// The `runtime = "nodejs"` config ensures `process.env.AUTH_SECRET`
// and `crypto` are available for JWT verification.

const ADMIN_ROUTES = /^\/admin(\/|$)/;
const PUBLIC_ADMIN_ROUTES = ["/admin/login"];
// API routes that are accessible without authentication (initial setup only)
const PUBLIC_ADMIN_API_ROUTES = ["/api/admin/seed"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Only handle admin routes
  if (!ADMIN_ROUTES.test(pathname) && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow the login page without authentication
  if (PUBLIC_ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    // If already authenticated, redirect to dashboard
    const sessionToken = request.cookies.get("idverify_session")?.value;
    if (sessionToken) {
      const session = verifySessionToken(sessionToken);
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Allow seed endpoint without authentication (initial setup only)
  if (PUBLIC_ADMIN_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check authentication for all other admin routes
  const sessionToken = request.cookies.get("idverify_session")?.value;
  const isApiRoute = pathname.startsWith("/api/admin");

  if (!sessionToken) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = verifySessionToken(sessionToken);

  if (!session) {
    if (isApiRoute) {
      const response = NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
      response.cookies.delete("idverify_session");
      return response;
    }
    // Invalid or expired token
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    loginUrl.searchParams.set("reason", "session_expired");

    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("idverify_session");
    return response;
  }

  // Valid session — pass through with session info in headers
  const response = NextResponse.next();
  response.headers.set("x-admin-id", session.adminId);
  response.headers.set("x-admin-email", session.email);
  return response;
}

export const config = {
  matcher: [
    // Match all admin routes — including API routes
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

// Force Node.js runtime — jsonwebtoken requires Node.js crypto
export const runtime = "nodejs";
