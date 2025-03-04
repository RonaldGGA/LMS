"use server";

import React from "react";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/auth";

const AuthGuard = async ({
  children,
  admitedRoles = [Role.MEMBER, Role.LIBRARIAN, Role.SUPERADMIN],
}: {
  children: React.ReactNode;
  admitedRoles?: Role[];
}) => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  if (!admitedRoles.includes(session.user.role)) {
    redirect("/");
  }

  return <>{children}</>;
};

export default AuthGuard;
