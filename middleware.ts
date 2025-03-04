import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const {
    nextUrl: { pathname, origin },
  } = req;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isLoggedIn = !!token;
  const userRole = token?.role || Role.MEMBER;

  const publicRoutes = ["/", "/about", "/contact"];
  const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];
  const adminRoutes = ["/dashboard", "/admin"];
  const apiAuthRoutes = ["/api/auth"];

  const isAuthRoute = ["/auth/login", "/auth/register", "/auth/error"].some(
    (path) => pathname.startsWith(path)
  );
  // 3. Manejo de rutas de API
  if (pathname.startsWith("/api")) {
    if (!isLoggedIn && !apiAuthRoutes.some((r) => pathname.startsWith(r))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // If not logged in
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", origin));
  }

  // 4. Redirección para usuarios autenticados
  if (isLoggedIn) {
    if (authRoutes.some((r) => pathname.startsWith(r))) {
      const redirectPath = ["LIBRARIAN", "SUPERADMIN"].includes(userRole)
        ? "/dashboard"
        : "/";
      return NextResponse.redirect(new URL(redirectPath, origin));
    }

    if (
      adminRoutes.some((r) => pathname.startsWith(r)) &&
      userRole === Role.MEMBER
    ) {
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  // 5. Protección de rutas privadas
  if (
    !isLoggedIn &&
    !publicRoutes.includes(pathname) &&
    !authRoutes.some((r) => pathname.startsWith(r))
  ) {
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Headers de seguridad adicionales
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}
// middleware.ts
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
