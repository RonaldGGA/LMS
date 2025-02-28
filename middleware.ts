import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || "fallback_secret", // ✅ Agrega fallback
    secureCookie: process.env.NODE_ENV === "production", // ✅ Cookie segura en prod
  });
  const isLoggedIn = !!token;
  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = ["/auth/login", "/auth/register"].includes(
    nextUrl.pathname
  );
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  if (isApiRoute) {
    NextResponse.next();
  }

  // If not logged in
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  // If logged in
  if (isLoggedIn) {
    // handle auth routes
    if (isAuthRoute) {
      if (
        token &&
        (token.role === Role.LIBRARIAN || token.role === Role.SUPERADMIN)
      ) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    // handle admin routes
    if (isAdminRoute) {
      if (token && token.role === Role.MEMBER) {
        NextResponse.redirect(new URL("/", nextUrl));
      }
    }
  }
  NextResponse.next();
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
