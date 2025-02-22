import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "react-hot-toast";

import { Andika } from "next/font/google";

import HomeNavbar from "./components/homeNavbar";
import { auth } from "@/auth";
import { getUserById } from "@/data/getUser";
import { SessionProvider } from "next-auth/react";
import IssuedBooksSpan from "./components/issued-books-span";

const andika = Andika({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  icons: "/bookIcon.svg",
  title: "LMS Home",
  description: "Search, add and issue books",
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
  }

  return (
    <html lang="en">
      <body className={` overflow-y-scroll ${andika.className} antialiased`}>
        {/* <NotificationsComponent /> */}
        <SessionProvider session={session}>
          {dbUser && (
            <div className="bgCustomized min-h-screen">
              <HomeNavbar user={dbUser} />
              <div className="w-full container mx-auto max-w-[1250px] relative">
                {children}
                {dbUser && dbUser.bookLoans.length > 0 && (
                  <IssuedBooksSpan
                    user_id={dbUser.id}
                    userBorrowedBooks={dbUser.bookLoans}
                  />
                )}
              </div>
            </div>
          )}
          {!dbUser && <> {children}</>}

          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
