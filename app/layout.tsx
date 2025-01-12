import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import HomeNavbar from "./components/homeNavbar";
import { auth } from "@/auth";
import { getUserById } from "@/data/getUser";
import { SessionProvider } from "next-auth/react";
import IssuedBooksSpan from "./components/issued-books-span";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  icons: "/bookIcon.svg",
  title: "LMS Home",
  description: "Here you can go for every functionality",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await getUserById(session.user.id);
    console.log("Fetched dbUser:", dbUser);
  } else {
    console.log("User session does not exist or userId is missing.");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          {dbUser && (
            <>
              <HomeNavbar user={dbUser} />
              <div className="w-full h-screen container mx-auto max-w-[1250px] relative">
                {children}
                <IssuedBooksSpan length={dbUser.issuedBooks.length} />
              </div>
            </>
          )}

          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
