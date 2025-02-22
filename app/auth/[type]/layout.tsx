import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LMS auth",
  description: "Create or authenticate as user or admin",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
