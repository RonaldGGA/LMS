import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@prisma/client";

import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const { nextUrl } = req;
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    const isLoggedIn = !!token?.sub;

    const isAuthRoute = ["/auth/login", "/auth/register"].includes(
      nextUrl.pathname
    );
    const isApiRoute = nextUrl.pathname.startsWith("/api");
    const isErrorPage = nextUrl.pathname.startsWith("/error");
    const isAdminRoute = nextUrl.pathname.startsWith("/dashboard");

    // Allow public routes and static files
    if (nextUrl.pathname.startsWith("/_next")) {
      return NextResponse.next();
    }

    // Handle API routes
    if (isApiRoute) {
      if (!isLoggedIn) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      return NextResponse.next();
    }

    if (isErrorPage) {
      return NextResponse.next();
    }

    // Redirect logic
    if (!isLoggedIn) {
      if (isAuthRoute) return NextResponse.next();
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }

    if (isLoggedIn && isAuthRoute) {
      return NextResponse.redirect(
        new URL(token.role === Role.MEMBER ? "/" : "/dashboard", nextUrl)
      );
    }

    if (isAdminRoute) {
      if (token.role === Role.MEMBER) {
        return NextResponse.redirect(new URL("/", nextUrl));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Error in middleware", error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 401 }
    );
  }
}
// auth.ts
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};
