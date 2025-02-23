"use client";

import { useUserSession } from "@/app/hooks/useUserSession";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useUserSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // User is authenticated
      if (
        session?.role === Role.SUPERADMIN ||
        session?.role === Role.LIBRARIAN
      ) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [session, router]);

  if (session) {
    return null; // Prevent rendering of auth pages if user is logged in
  }

  return <div>{children}</div>; // Render auth pages if not authenticated
}
