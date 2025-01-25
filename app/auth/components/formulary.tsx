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
import Image from "next/image";
import toast from "react-hot-toast";
import { registerUser } from "@/actions/auth-user";
import { signIn } from "next-auth/react";

interface FormularyProps {
  type: string;
  footerLink: string;
}

const Formulary: React.FC<FormularyProps> = ({ type, footerLink }) => {
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
      ...(isLogin ? {} : { DNI: "" }),
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (isLogin) {
      const result = loginSchema.safeParse(values);
      if (!result.success) {
        toast("Invalid values");
        return;
      }
      const res = await signIn("credentials", {
        username: values.username,
        password: values.password,
      });
      console.log(res);
      console.log(["WTF"]);
      toast("loading");
      return;
    }
    if (!registerSchema.safeParse(values).success) {
      toast("Invalid values");
      return;
    }
    //Register the user
    const result = await registerUser(values);
    if (result?.success) {
      toast.success("User Registered Succesfully");
      await signIn("credentials", {
        username: values.username,
        password: values.password,
      });
      toast("User logged in...");
    } else {
      toast(result!.error);
    }
    return;
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
                      className="password-input"
                      placeholder="---"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <Image
                      onClick={handleShowPassword}
                      className="absolute right-2 inset-y-1"
                      width="25"
                      height="25"
                      alt="show/hidde-password"
                      src={showPassword ? "/eyeclosed.svg" : "/eye.svg"}
                    />
                  </div>
                </FormControl>

                <FormDescription>This is your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {type == "register" && (
            <FormField
              name="DNI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <Input placeholder="06061232434" type="text" {...field} />
                  </FormControl>
                  <FormDescription>This is your DNI number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-center">
            <Button className="p-5">Get In</Button>
          </div>
          <p className=" text-gray-400 max-w-[380px]text-sm ">
            By accesing this system, you accept the{" "}
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
      <Link
        href={"#"}
        className="block  text-center text-base underline underline-offset-2"
      >
        Forgot your password?
      </Link>
    </AuthCard>
  );
};

export default Formulary;
