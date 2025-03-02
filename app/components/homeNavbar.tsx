"use client";

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
import Image from "next/image";
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
  }, [user?.id, pathname]);

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
    await signOut(); // Assuming you're using next-auth
    router.push("/auth/login");
  };
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <BookIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              LibraryHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {(user.role === Role.LIBRARIAN ||
              user.role === Role.SUPERADMIN) && (
              <>
                <Link
                  href="/add"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Book
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <CircuitBoard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <Link
            href="/search"
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <Link
              href={
                user.role === Role.MEMBER
                  ? "/notifications/user"
                  : "/notifications/admin"
              }
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {((userNotificationsCount > 0 && user.role == Role.MEMBER) ||
                (adminNotificationsCount > 0 &&
                  ["SUPERADMIN", "LIBRARIAN"].includes(user.role))) && (
                <div className="absolute top-5 -right-5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"></div>
              )}
            </Link>
          </div>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 focus:outline-none group w-ful">
              {user.img ? (
                <Image
                  src={user.img}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full aspect-[1] object-cover border-2 border-transparent group-hover:border-blue-100 transition-colors"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 mt-2 shadow-lg border border-gray-100 rounded-lg">
              <Link href="/profile">
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">Profile</span>
                </DropdownMenuItem>
              </Link>

              <Link href="/issued">
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                  <BookIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">My Books</span>
                </DropdownMenuItem>
              </Link>

              {(user.role === Role.LIBRARIAN ||
                user.role === Role.SUPERADMIN) && (
                <div className="md:hidden border-t border-gray-100">
                  <Link href="/add">
                    <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                      <Plus className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Add Book</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/dashboard">
                    <DropdownMenuItem className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                      <CircuitBoard className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                </div>
              )}

              <div className="border-t border-gray-100">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-red-600"
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
