"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const type = params.get("type");

  const handleLoginClick = () => {
    if (pathname == "/auth/user") {
      router.replace("/auth/user?type=login");
    } else {
      router.replace("/auth/admin?type=login");
    }
  };

  const handleRegisterClick = () => {
    if (pathname == "/auth/user") {
      router.replace("/auth/user?type=register");
    } else {
      router.replace("/auth/admin?type=register");
    }
  };
  if (pathname === "/auth/user") {
    return (
      <div className="z-20 sticky  bg-white  shadow-sm  w-full flex items-center justify-center h-[90px]">
        <div className="w-full max-w-[1440px] flex items-center justify-between h-[100px] px-5 md:px-10">
          <Link href="/" className=" relative flex items-center gap-2">
            <Image src="/bookIcon.svg" alt="logo" width={45} height={45} />
            <p className="font-medium text-2xl tracking-wide"> LMS</p>
          </Link>
          <div className="self-stretch justify-start items-center inline-flex">
            <button
              onClick={handleLoginClick}
              className={clsx(
                `p-3 px-4 font-normal`,
                type === "login"
                  ? "bg-sky-800 rounded-l-md text-white"
                  : "shadow-inner"
              )}
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className={clsx(
                `p-3 px-4 font-normal`,
                type === "register"
                  ? "bg-sky-800  rounded-r-md text-white"
                  : "shadow-inner"
              )}
            >
              Register
            </button>
          </div>
          <Link
            href="/auth/admin?type=login"
            className="text-black text-base font-medium"
          >
            Admin Login
          </Link>
        </div>
      </div>
    );
  } else if (pathname == "/auth/admin") {
    return (
      <div className="z-20 sticky mb-10 bg-white  w-full flex items-center justify-center">
        <div className="w-full max-w-[1440px] flex items-center justify-between h-[100px] px-5 md:px-10">
          <div className="w-[174px] h-[40px] relative">
            <Image src="/logoplace.svg" alt="logo" fill />
          </div>
          <div className="self-stretch justify-start items-center inline-flex">
            <button
              onClick={handleLoginClick}
              className={clsx(
                `p-3 px-4 font-normal`,
                type === "login"
                  ? "bg-green-500 rounded-l-md text-white"
                  : "shadow-inner"
              )}
            >
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className={clsx(
                `p-3 px-4 font-normal`,
                type === "register"
                  ? "bg-green-500 rounded-r-md text-white"
                  : "shadow-inner"
              )}
            >
              Register
            </button>
          </div>
          {pathname === "/auth/admin" ? (
            <Link
              href="/auth/user?type=login"
              className="text-black text-base font-medium"
            >
              User Login
            </Link>
          ) : (
            <Link
              href="/auth/admin?type=login"
              className="text-black text-base font-medium"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    );
  }
};

export default Navbar;
