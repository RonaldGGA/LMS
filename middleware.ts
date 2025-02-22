import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request:NextRequest) {
  const token = await 
  const { pathname } = new URL(request.url);

  // 1. Siempre permitir las rutas de API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Rutas de autenticación (/auth/[type])
  if (pathname.startsWith("/auth")) {
    const type = pathname.split("/auth/")[1]?.split("/")[0] || "";

    // Permitir solo /auth/login y /auth/register
    if (!["login", "register"].includes(type)) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Si el usuario ya está autenticado, redirigir al dashboard
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // 3. Rutas protegidas (dashboard y siguientes)
  if (pathname.startsWith("/dashboard") || pathname === "/") {
    // Si el usuario no está autenticado, redirigir a login
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Verificar si el usuario es admin
    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
  }

  // Si no coincide con ninguna condición, seguir con la solicitud
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
