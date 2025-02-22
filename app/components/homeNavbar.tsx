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
  LogOut,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HomeNavbarProps {
  user: {
    id: string;
    role: Role;
    img: string | null;
    username: string;
    password: string;
    bookLoans: {
      status: BookLoanStatus;
      returnDate: Date | null;
    }[];
  };
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({ user }) => {
  const [userNotificationsCount, setUserNotificationsCount] = useState(0);
  const [adminNotificationsCount, setAdminNotificationsCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const getUserCount = async () => {
      const countResponse = await getUserNotificationsCount(user.id);
      if (countResponse.success) {
        setUserNotificationsCount(countResponse.data ? countResponse.data : 0);
      }
    };
    getUserCount();
  }, [user.id, pathname]);

  useEffect(() => {
    const getAdminCount = async () => {
      const countResponse = await getAdminNotificationsCount();
      if (countResponse.success) {
        setAdminNotificationsCount(countResponse.data ? countResponse.data : 0);
      }
    };
    getAdminCount();
  }, []);

  return (
    <div className="max-w-[97%] mx-auto h-[90px] flex items-center justify-center ">
      <div className="max-w-[1240px] w-full flex items-center justify-between p-4 shadow gap-5 bg-gray-100 rounded">
        <Link href="/" className=" relative flex items-center gap-2">
          <Image src="/bookIcon.svg" alt="logo" width={45} height={45} />
          <p className="font-medium text-2xl tracking-wide"> LMS</p>
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <Link href={"/"}>
            <Search />
          </Link>
          {user.role === Role.MEMBER ? (
            <Link className="relative" href={"/notifications/user"}>
              <Bell />
              {userNotificationsCount > 0 &&
                pathname !== "/notifications/user" && (
                  <div className="absolute -top-1 right-0 rounded-full w-3 h-3  bg-red-500"></div>
                )}
            </Link>
          ) : (
            user.role === Role.LIBRARIAN ||
            (user.role === Role.SUPERADMIN && (
              <Link className="relative" href={"/notifications/admin"}>
                <Bell />
                {adminNotificationsCount > 0 &&
                  pathname !== "/notifications/admin" && (
                    <div className="absolute -top-1 right-0 rounded-full w-3 h-3  bg-red-500"></div>
                  )}
              </Link>
            ))
          )}

          {user.role === Role.LIBRARIAN ||
            (user.role === Role.SUPERADMIN && (
              <Link
                className="text-sm font-semibold hover:underline underline-offset-4 transition hidden md:block"
                href="/add"
              >
                Add book
              </Link>
            ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 border  rounded-md">
              {user.img && user.img !== null ? (
                <Image
                  alt="user-img"
                  src={user.img}
                  width={40}
                  height={40}
                  className="rounded-full bg-center"
                />
              ) : (
                <>
                  <p>
                    {user.username.length > 10
                      ? user.username.slice(0, 10).concat("...")
                      : user.username}{" "}
                  </p>
                </>
              )}
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col left-0 top-full">
              <Link href="/profile">
                <DropdownMenuItem className="flex items-center  gap-1">
                  <Settings /> Edit Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/issued">
                <DropdownMenuItem className="flex items-center  gap-1">
                  <BookIcon /> Your issued Books
                </DropdownMenuItem>
              </Link>
              {user.role === Role.LIBRARIAN ||
                (user.role === Role.SUPERADMIN && (
                  <Link className="md:hidden" href="/add">
                    <DropdownMenuItem className="flex items-center  gap-1">
                      <Plus />
                      Add book
                    </DropdownMenuItem>
                  </Link>
                ))}

              <DropdownMenuItem
                onClick={() => signOut()}
                className="flex items-center  gap-1"
              >
                <LogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
