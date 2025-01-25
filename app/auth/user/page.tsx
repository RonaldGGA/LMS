"use client";

import React from "react";
import Formulary from "../components/formulary";
import LoginLeft from "../components/login-left";

import { useRouter, useSearchParams } from "next/navigation";

const UserAuth = () => {
  const params = useSearchParams();
  const type = params.get("type") || "login";
  const router = useRouter();

  if (!["login", "register"].includes(type)) {
    // If the type is invalid, redirect or handle the error as needed
    router.push("/auth/user?type=login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-10 bg-cover bg-center relative text-gray-100">
      <div
        className="absolute inset-0 brightness-50 min-h-screen bg-cover bg-center "
        style={{ backgroundImage: "url(/register.jpg)" }}
      ></div>
      <div className="text-gray-100  md:flex-row-reverse items-center justify-center flex gap-5 flex-col backdrop-blur-md">
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
