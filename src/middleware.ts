import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionCookieAsync } from "@/lib/admin-session-edge";

const adminProtectedPaths = ["/admin/dashboard", "/admin/lottery"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = adminProtectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) return NextResponse.next();

  const cookieHeader = request.headers.get("cookie");
  const session = await verifySessionCookieAsync(cookieHeader);
  if (session) return NextResponse.next();

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/lottery/:path*"],
};
