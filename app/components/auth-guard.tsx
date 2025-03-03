"use client";

import React, { useEffect } from "react";
import { useUserSession } from "../hooks/useUserSession";
import { usePathname, useRouter } from "next/navigation";
import { Role } from "@prisma/client";

const AuthGuard = ({
  children,
  admitedRoles = [Role.MEMBER, Role.LIBRARIAN, Role.SUPERADMIN],
}: {
  children: React.ReactNode;
  admitedRoles?: Role[];
}) => {
  const session = useUserSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${pathname}`);
    } else if (!admitedRoles.includes(session.role)) {
      router.push("/");
    }
  }, [session, admitedRoles, router, pathname]);

  return <>{children}</>;
};

export default AuthGuard;
