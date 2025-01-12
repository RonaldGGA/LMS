"use client";

import { useSession } from "next-auth/react";

export const useUserSession = () => {
  const session = useSession();
  return session?.data?.user?.userId;
};
