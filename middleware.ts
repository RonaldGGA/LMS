import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const isLoggedIn = !!token;
  const { pathname } = new URL(request.url);

  // 1. Always allow API routes without authentication
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Handle authentication routes
  if (pathname.startsWith("/auth")) {
    // Extract the type from the URL
    const authType = pathname.split("/auth/")[1]?.split("/")[0] || "";

    // Only allow /auth/login and /auth/register
    if (!["login", "register"].includes(authType)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // If the user is already authenticated, redirect to the dashboard
    if (isLoggedIn) {
      if (token.role === Role.MEMBER) {
        return NextResponse.redirect(new URL("/", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Allow access to login and register pages
    return NextResponse.next();
  }

  // 3. All other routes require authentication
  if (!isLoggedIn) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 4. Optionally, protect specific routes based on roles
  if (pathname.startsWith("/dashboard")) {
    // Only allow access to admins
    if (token?.role === Role.MEMBER) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
  }

  // 5. Allow all other authenticated access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
