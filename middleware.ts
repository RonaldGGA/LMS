import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;

  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isErrorPage = nextUrl.pathname.startsWith("/error");

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isErrorPage) {
    return NextResponse.next();
  }

  // If not logged in
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  // If logged in
  if (isLoggedIn && isAuthRoute) {
    const user = token;
    if (
      user &&
      (user.role === Role.LIBRARIAN || user.role === Role.SUPERADMIN)
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.redirect(new URL("/", nextUrl));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "^/((?!_next|static|public|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$)).*",
    // Always run middleware for API and TRPC routes
    "/(api|trpc)(/.*)?",
    // Optionally, add any additional routes you want to enforce
    "/auth/(.*)",
    "/admin/(.*)",
  ],
};
