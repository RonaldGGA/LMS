"use client";

import { useSession } from "next-auth/react";

export const useUserSession = () => {
  const session = useSession();
  // console.log(session);
  return session?.data?.user;
};
