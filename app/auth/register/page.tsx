"use client";

import React, { useState } from "react";
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
import { registerSchema } from "@/zod-schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { registerUser } from "@/actions/auth-user";
import { AlertCircle, Eye, EyeClosed, Loader2 } from "lucide-react";
import { authenticate } from "@/actions/sign-in";

const RegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      dni: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log(values);
    if (values.confirmPassword !== values.password) {
      return setErrorMessage("Passwords do not match");
    }

    try {
      setLoading(true);
      const result = await registerUser({
        username: values.username,
        password: values.password,
        dni: values.dni,
      });
      console.log(result);

      if (result.success && !result.error) {
        toast.success("Registration successful!");

        const res = await authenticate(values);
        if (res) {
          setErrorMessage(res);
        } else {
          setErrorMessage("");
          window.location.href = "/dashboard";
        }
        setLoading(false);
      } else {
        if (result.error) {
          console.log(result.error?.developerMessage);
          setErrorMessage(result.error?.userMessage);
        } else {
          setErrorMessage("Authentication failed, please try again");
        }
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Connection problem. Check your internet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
        <p className="text-gray-600">Create a new account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Username*
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
                  Password*
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
                      onClick={() => setShowPassword(!showPassword)}
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Confirm Password*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    className="h-12 rounded-lg pr-12"
                    {...field}
                    {...form.register("confirmPassword", {
                      validate: (value) =>
                        value === form.watch("password") ||
                        "Passwords do not match",
                    })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  DNI*
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
            {loading ? "Loading..." : "Create account"}
          </Button>
          {errorMessage && (
            <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?
            <Link
              href={"/auth/login"}
              className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
            >
              Login
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default RegisterPage;
