"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAdminNotificationsCount,
  getUserNotificationsCount,
} from "@/data/getNotifications";
import { BookLoanStatus, Role } from "@prisma/client";
import {
  Bell,
  BookIcon,
  ChevronDown,
  CircuitBoard,
  LogOut,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HomeNavbarProps {
  user:
    | {
        id: string;
        role: Role;
        img: string | null;
        username: string;
        password: string;
        bookLoans: {
          status: BookLoanStatus;
          returnDate: Date | null;
        }[];
      }
    | null
    | undefined;
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({ user }) => {
  const [userNotificationsCount, setUserNotificationsCount] = useState(0);
  const [adminNotificationsCount, setAdminNotificationsCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(pathname);

    const getUserCount = async () => {
      if (user) {
        const countResponse = await getUserNotificationsCount(user.id);
        if (countResponse.success) {
          setUserNotificationsCount(
            countResponse.data ? countResponse.data : 0
          );
        }
      }
    };
    getUserCount();
  }, [user?.id, pathname, user]);

  useEffect(() => {
    const getAdminCount = async () => {
      const countResponse = await getAdminNotificationsCount();
      if (countResponse.success) {
        setAdminNotificationsCount(countResponse.data ? countResponse.data : 0);
      }
    };

    getAdminCount();
    console.log();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({
      redirectTo: "/auth/login",
    }); // Assuming you're using next-auth
    router.push("/auth/login");
  };
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-library-dark border-b border-library-midnight shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <BookIcon className="w-8 h-8 text-golden-amber transition-colors group-hover:text-antique-gold" />
            <span className="text-xl font-bold text-ivory-50 tracking-tight hover:text-antique-gold transition-colors">
              LibraryHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {(user?.role === Role.LIBRARIAN ||
              user?.role === Role.SUPERADMIN) && (
              <>
                <Link
                  href="/books/add"
                  className="text-ivory-50 hover:text-antique-gold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4 text-golden-amber" />
                  Add Book
                </Link>
                <Link
                  href="/dashboard"
                  className="text-ivory-50 hover:text-antique-gold transition-colors flex items-center gap-1"
                >
                  <CircuitBoard className="w-4 h-4 text-golden-amber" />
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 text-ivory-50 hover:text-antique-gold transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>

          <div className="relative flex items-center justify-center">
            <Link
              href={
                user?.role === Role.MEMBER
                  ? "/notifications/user"
                  : "/notifications/admin"
              }
              className="p-2 text-ivory-50 hover:text-antique-gold transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {user.role === Role.MEMBER && userNotificationsCount > 0 ? (
                <div className="absolute top-0 right-0 bg-golden-amber text-vintage-blue-900 text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {userNotificationsCount}
                </div>
              ) : (
                user.role !== Role.MEMBER &&
                adminNotificationsCount > 0 && (
                  <div className="absolute top-0 right-0 bg-golden-amber text-vintage-blue-900 text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {adminNotificationsCount}
                  </div>
                )
              )}
            </Link>
          </div>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none group">
              <Avatar>
                <AvatarImage src={user.img ? user.img : ""} />
                <AvatarFallback>
                  {" "}
                  {user?.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <ChevronDown className="w-4 h-4 text-ivory-50 group-hover:text-antique-gold transition-colors" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 mt-2 shadow-lg border border-library-midnight rounded-lg bg-ivory-50 ">
              <Link href="/profile">
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5  cursor-pointer">
                  <Settings className="w-4 h-4 text-antique-gold" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>

              <Link href="/books/issued">
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5  cursor-pointer">
                  <BookIcon className="w-4 h-4 text-antique-gold" />
                  <span>My Books</span>
                </DropdownMenuItem>
              </Link>

              {(user?.role === Role.LIBRARIAN ||
                user?.role === Role.SUPERADMIN) && (
                <div className="md:hidden border-t border-library-midnight">
                  <Link href="/books/add">
                    <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5  cursor-pointer">
                      <Plus className="w-4 h-4 text-antique-gold" />
                      <span>Add Book</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard">
                    <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5  cursor-pointer">
                      <CircuitBoard className="w-4 h-4 text-antique-gold" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                </div>
              )}

              <div className="border-t border-library-midnight">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5  cursor-pointer text-antique-gold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
