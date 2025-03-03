import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;

  // Rutas públicas que no requieren autenticación
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

  // Protección de rutas de API
  if (nextUrl.pathname.startsWith("/api")) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Redirección a la página de login si no está autenticado
  if (!isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Control de roles para rutas específicas
  const adminRoutes = ["/dashboard", "/admin"];

  if (
    adminRoutes.some((route) => nextUrl.pathname.startsWith(route)) &&
    token.role === Role.MEMBER
  ) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
