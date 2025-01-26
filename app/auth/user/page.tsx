"use client";

import React from "react";
import Formulary from "../components/formulary";
import LoginLeft from "../components/login-left";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const UserAuth = () => {
  const params = useSearchParams();
  const type = params.get("type") || "login";
  const router = useRouter();

  if (!["login", "register"].includes(type)) {
    // If the type is invalid, redirect or handle the error as needed
    router.push("/auth/user?type=login");
  }

  return (
    <div className="bgCustomized flex items-center justify-center min-h-screen py-10 bg-cover bg-center relative text-gray-100 ">
      <Image
        className="absolute inset-0 brightness-[30%] min-h-screen bg-cover bg-center "
        src={"/register.jpg "}
        fill
        alt="bg-image"
        loading="lazy"
      />
      <div className="text-gray-100  md:flex-row-reverse items-center justify-center flex gap-5 flex-col backdrop-blur-md rounded-md lg:rounded-l-none lg:rounded-r-md max-w-[95%]">
        {/* Área de formulario */}
        <Formulary
          type={type}
          footerLink={`/auth/user?type=${
            type == "login" ? "register" : "login"
          }`}
        />
        <div className="hidden lg:block h-[600px] border w-0"></div>
        {/* Sección de la cita */}
        <LoginLeft />
      </div>
    </div>
  );
};

export default UserAuth;
