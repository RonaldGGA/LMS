"use client";

import React from "react";

import Image from "next/image";
import Formulary from "./components/formulary";

const AuthPage = ({ params }: { params: { type: "login" | "register" } }) => {
  const { type } = params;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Sección de Imagen */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 hidden lg:flex flex-col items-center justify-center p-12 relative">
          <div className="text-white text-center space-y-8 max-w-md">
            <div className="space-y-4">
              <blockquote className="text-2xl font-light leading-relaxed">
                “The only true wisdom is in knowing you know nothing”
              </blockquote>
              <p className="text-sm font-medium">- Socrates</p>
            </div>

            <div className="relative w-full aspect-square rounded-xl overflow-hidden border-4 border-white/20">
              <Image
                src="/login.jpg"
                alt="Library"
                fill
                className="object-cover"
                priority
                sizes={""}
              />
            </div>

            <div className="flex justify-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span>Open: 8:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-red-400 rounded-full" />
                <span>Close: 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>
        {/* Sección de Formulario */}
        <div className="p-8 sm:p-12 lg:p-16">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {type === "login" ? "Welcome Back" : "Get Started"}
            </h1>
            <p className="text-gray-600">
              {type === "login"
                ? "Sign in to your account"
                : "Create a new account"}
            </p>
          </div>

          <Formulary
            type={type}
            footerLink={`/auth/${type === "login" ? "register" : "login"}`}
          />
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
