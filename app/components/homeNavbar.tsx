"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { IssuedBook, User } from "@prisma/client";
import {
  ArrowDown,
  ChevronDown,
  LockOpen,
  LogOut,
  LucideWindArrowDown,
  MoreHorizontal,
  Move3D,
  MoveDown,
  MoveDownIcon,
  MoveDownLeftIcon,
  Plus,
  Search,
  SearchIcon,
  Settings,
  Settings2,
  Settings2Icon,
  SettingsIcon,
  WindArrowDown,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HomeNavbarProps {
  user: User & {
    issuedBooks: IssuedBook[];
  };
}

const HomeNavbar: React.FC<HomeNavbarProps> = ({ user }) => {
  return (
    <div className="h-[100px] flex items-center justify-center ">
      <div className="max-w-[1240px] w-full flex items-center justify-between p-5 shadow gap-5 ">
        <Link href="/" className=" relative">
          <Image src="/logoplace.svg" alt="logo" width={174} height={40} />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            className="text-sm font-semibold hover:underline underline-offset-4 transition hidden md:block"
            href="/add"
          >
            Add book
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 border p-2 rounded-md">
              {user.username} <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col left-0 top-full">
              <Link href="/">
                <DropdownMenuItem className="flex items-center  gap-1">
                  <Settings /> Edit Profile
                </DropdownMenuItem>
              </Link>
              <Link className="md:hidden" href="/add">
                <DropdownMenuItem className="flex items-center  gap-1">
                  <Plus />
                  Add book
                </DropdownMenuItem>
              </Link>

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
