"use client";

import React, { useState } from "react";
import AuthCard from "./authCard";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Eye, EyeClosed } from "lucide-react";
import { authenticate } from "@/actions/sign-in";
import { useFormState, useFormStatus } from "react-dom";

interface FormularyProps {
  type: string;
  footerLink: string;
}

const Formulary: React.FC<FormularyProps> = ({ type, footerLink }) => {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev); // Cambia el estado a su opuesto
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

  async function onSubmit(values: z.infer<typeof schema>) {
    if (isLogin) {
      dispatch({ username: values.username, password: values.password });
    } else {
      if (!registerSchema.safeParse(values).success) {
        toast.error("Invalid values");
        return;
      }
      // Register the user
      const result = await registerUser(values);
      if (result?.success) {
        toast.success("User Registered Successfully");

        dispatch({ username: values.username, password: values.password });
      } else {
        toast.error(result!.error);
        return;
      }
    }
    toast.success("User logged in successfully");

    return;
  }

  function LoginButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        variant={"outline"}
        className="p-5"
        aria-disabled={pending}
        type="submit"
      >
        Get In
      </Button>
    );
  }

  return (
    <AuthCard type={type} footerLink={footerLink}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Ricardo" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex relative">
                    <Input
                      className="password-input "
                      placeholder="---"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />

                    <div
                      className="absolute flex items-center justify-center right-0 inset-y-0  w-10 h-10"
                      onClick={handleShowPassword}
                    >
                      {showPassword ? <EyeClosed /> : <Eye />}
                    </div>
                  </div>
                </FormControl>

                {/* <FormDescription>Type your password</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {type == "register" && (
            <FormField
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <Input placeholder="06061232434" type="text" {...field} />
                  </FormControl>
                  <FormDescription>Type your DNI number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-center text-black">{LoginButton()}</div>
          <p className=" text-gray-400 max-w-[380px]text-sm ">
            By accessing this system, you accept the{" "}
            <Link
              href="#"
              className="hover:text-gray-600 transition-colors underline underline-offset-2"
            >
              Terms & Conditions
            </Link>
            .
          </p>
        </form>
      </Form>

      <div className="mt-5 w-[300px] mb-2 h-[0px] border border-gray-300 mx-auto"></div>
      {/* <Link
        href={"#"}
        className="block  text-center text-base underline underline-offset-2"
      >
        Forgot your password?
      </Link> */}
      {errorMessage && (
        <>
          <p className="text-sm text-red-500">{errorMessage}</p>
        </>
      )}
    </AuthCard>
  );
};

export default Formulary;
