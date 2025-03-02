import type { Metadata } from "next";
import "./globals.css";

import { Andika } from "next/font/google";

import HomeNavbar from "./components/homeNavbar";
import { auth } from "@/auth";
import { getUserById } from "@/data/getUser";
import { SessionProvider } from "next-auth/react";
import IssuedBooksSpan from "./components/issued-books-span";
import { format } from "date-fns";
import { Toaster } from "react-hot-toast";

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
    <html>
      <SessionProvider session={session}>
        <body
          className={`min-h-screen bg-gradient-to-b from-gray-50 to-white relative font-${andika}`}
        >
          <Toaster />
          <HomeNavbar user={dbUser} />
          <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 pb-40">
            {children}

            {dbUser && dbUser.bookLoans.length > 0 && (
              <IssuedBooksSpan
                user_id={dbUser.id}
                userBorrowedBooks={dbUser.bookLoans}
              />
            )}
          </main>

          {/* Footer Opcional */}
          <footer className="border-t border-gray-200 mt-16 absolute bottom-0 left-0 w-full -z-10">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-sm text-gray-500">
              © {format(new Date(Date.now()), "yyy")} LibraryHub. All rights
              reserved.
            </div>
          </footer>
        </body>
      </SessionProvider>
    </html>
  );
}
