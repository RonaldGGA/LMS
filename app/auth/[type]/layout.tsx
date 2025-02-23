import { auth } from "@/auth";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "LMS auth",
  description: "Create or authenticate as user or admin",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (session?.user) {
    return null;
  }
  return <div>{children}</div>;
}
