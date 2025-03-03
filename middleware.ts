import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

import { NextRequest } from "next/server";
export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;

  // 1. Manejo de rutas públicas
  const publicRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/terms",
    "/privacy",
    "/about",
  ];

  if (publicRoutes.some((route) => nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Protección de rutas de API
  if (nextUrl.pathname.startsWith("/api")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // 3. Redirección lógica mejorada
  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Control de roles
  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isAdminRoute && token.role === Role.MEMBER) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|auth|favicon.ico).*)"],
};
