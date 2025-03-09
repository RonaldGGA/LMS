import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
  adminRoutes,
} from "@/routes";
import { NextResponse } from "next/server";
import { auth } from "./auth";
import { Role } from "@prisma/client";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const session = req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  //Awlays allow going to the apiauth

  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  //allow to auth if not authenticated, if it is, dont allow
  if (isAuthRoute) {
    if (isLoggedIn) {
      if (session?.user.role === Role.MEMBER) {
        return NextResponse.redirect(
          new URL(DEFAULT_LOGIN_REDIRECT[0], nextUrl)
        );
      } else {
        return NextResponse.redirect(
          new URL(DEFAULT_LOGIN_REDIRECT[1], nextUrl)
        );
      }
    }
    return NextResponse.next();
  }
  //if is not public and isnt logged in dont allow going there
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    console.log({ NEXT_URL: nextUrl.search });
    if (nextUrl.search) {
      console.log({ NEXT_SEARCH: nextUrl.search });
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (isLoggedIn && isAdminRoute && session?.user.role === Role.MEMBER) {
    const url = new URL("/error", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    "/",
    "/books(/.*)?",
    "/dashboard(/.*)?",
    "/api/((?!auth).*)",
    "/auth",
    "/profile(/.*)?",
    "/notifications(/.*)?",
  ],
};
