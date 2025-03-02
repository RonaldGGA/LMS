"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "@/zod-schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { registerUser } from "@/actions/auth-user";
import { AlertCircle, Eye, EyeClosed, Loader2 } from "lucide-react";
import { authenticate } from "@/actions/sign-in";
import { useFormState } from "react-dom";
import { ServiceError } from "@/types";
import { ERROR_CODES } from "@/lib/utils";
import NextImprovements from "@/app/components/next-improvements";

interface FormularyProps {
  type: string;
  footerLink: string;
}

const Formulary: React.FC<FormularyProps> = ({ type, footerLink }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [loading, setLoading] = useState(false);
  const [registerErrorMessage, setRegisterErrorMessage] = useState("");

  const [buttonMessage, setButtonMessage] = useState("");

  useEffect(() => {
    setButtonMessage(
      type === "login"
        ? loading
          ? "Signing In..."
          : "Sign In"
        : loading
        ? "Creating Account..."
        : "Create Account"
    );
  }, [loading, type]);

  useEffect(() => {
    if (errorMessage !== undefined) {
      setLoading(false);
      form.reset();
    }
  }, [errorMessage]);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const isLogin = type === "login";

  const schema = isLogin ? loginSchema : registerSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      ...(isLogin ? {} : { dni: "" }),
    },
  });

  const handleRegistrationError = (error?: ServiceError) => {
    const defaultError = ERROR_CODES.UNKNOWN;
    const errorCode = error?.code || defaultError.code;

    const errorMap: Record<string, string> = {
      [ERROR_CODES.DNI_TAKEN.code]: "DNI already taken",
      [ERROR_CODES.VALIDATION.code]:
        error?.userMessage || defaultError.userMessage,
      [ERROR_CODES.DNI_INVALID.code]: "Please enter a valid ID number",
      [ERROR_CODES.USER_EXISTS.code]: "Username already exists",
      [ERROR_CODES.PASSWORD_HASH.code]: "Registration failed. Try again",
      [ERROR_CODES.DATABASE.code]: "Service unavailable. Try again later",
    };

    setRegisterErrorMessage(errorMap[errorCode] || defaultError.userMessage);

    if (error?.developerMessage) {
      console.error(
        `Registration Error [${errorCode}]:`,
        error.developerMessage
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(values: any) {
    setLoading(true);
    if (!values.username.trim() || !values.password.trim()) {
      form.trigger();
      return;
    }

    if (isLogin) {
      dispatch({
        username: values.username,
        password: values.password,
      });
      setTimeout(() => {
        if (errorMessage) {
          setLoading(false);
        }
      }, 3000);

      return;
    }
    try {
      const result = await registerUser({
        username: values.username,
        password: values.password!,
        dni: values.dni,
      });

      if (result.success) {
        toast.success("Registration successful!");

        dispatch({
          username: values.username,
          password: values.password!,
        });
      } else {
        handleRegistrationError(result.error);
      }
    } catch (error) {
      console.log(error);
      handleRegistrationError({
        code: "client_error",
        userMessage: "Connection problem. Check your internet",
        developerMessage: "Network error",
      });
    } finally {
      setLoading(false);
    }
  }

  const next = [
    "Improve code logic for a better developer understanding",
    "change the any line and actually implement a type",
    "Make this page a little more beautiful",
  ];
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    className="h-12 rounded-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      className="h-12 rounded-lg pr-12"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10"
                      onClick={handleShowPassword}
                    >
                      {showPassword ? (
                        <EyeClosed className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo DNI para registro */}
          {type === "register" && (
            <FormField
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    DNI
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your DNI"
                      className="h-12 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium relative"
          >
            {loading && (
              <div className="absolute left-4 top-3.5">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
            {buttonMessage}
          </Button>

          {errorMessage && (
            <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {registerErrorMessage && (
            <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{registerErrorMessage}</span>
            </div>
          )}

          <p className="text-center text-sm text-gray-600">
            {type === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              href={footerLink}
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
            >
              {type === "login" ? "Register" : "Login"}
            </Link>
          </p>
        </form>
      </Form>
      {
        <NextImprovements className={"mt-10 space-y-5"}>
          <ul className="space-y-2">
            {next.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </NextImprovements>
      }
    </>
  );
};

export default Formulary;
