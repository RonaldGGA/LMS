"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IssuedBook, User } from "@prisma/client";
import { BookIcon, ChevronDown, LogOut, Plus, Settings } from "lucide-react";
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
    <div className="max-w-[97%] mx-auto h-[90px] flex items-center justify-center ">
      <div className="max-w-[1240px] w-full flex items-center justify-between p-4 shadow gap-5 bg-gray-100 rounded">
        <Link href="/" className=" relative flex items-center gap-2">
          <Image src="/bookIcon.svg" alt="logo" width={45} height={45} />
          <p className="font-medium text-2xl tracking-wide"> LMS</p>
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
