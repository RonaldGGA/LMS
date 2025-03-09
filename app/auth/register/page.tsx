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
import {
  AlertCircle,
  BookOpen,
  Eye,
  EyeClosed,
  IdCardIcon,
  LibrarySquare,
  Loader2,
  ShieldCheck,
  UserIcon,
} from "lucide-react";
import { authenticate } from "@/actions/sign-in";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);
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
    if (!checked) {
      return setErrorMessage(
        "You have to agree with the terms & conditions before"
      );
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
          window.location.reload();
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
    <div className="max-w-md mx-auto space-y-8">
      {/* Encabezado temático */}
      <div className="text-center space-y-4">
        <div className="inline-flex bg-library-dark/5 p-4 rounded-2xl">
          <LibrarySquare className="h-12 w-12 text-library-dark" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-library-dark">
          Join Our Digital Library
        </h1>
        <p className="text-lg text-library-dark/80">
          Create your research account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Campo DNI con icono */}
          <FormField
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-library-dark/80">
                  National ID (DNI)*
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="Enter your ID number"
                      className="h-14 rounded-xl border-library-dark/20 focus:ring-2 focus:ring-antique-gold/50 text-library-dark placeholder:text-library-dark/40 hover:border-library-dark/30 transition-all"
                      {...field}
                    />
                    <IdCardIcon className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-library-dark/40 group-focus-within:text-antique-gold" />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600/90 text-sm" />
              </FormItem>
            )}
          />

          {/* Campo Usuario */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-library-dark/80">
                  Username*
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="Create your unique reader ID"
                      className="h-14 rounded-xl border-library-dark/20 focus:ring-2 focus:ring-antique-gold/50 text-library-dark placeholder:text-library-dark/40 hover:border-library-dark/30 transition-all"
                      {...field}
                    />
                    <UserIcon className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-library-dark/40 group-focus-within:text-antique-gold" />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600/90 text-sm" />
              </FormItem>
            )}
          />

          {/* Sección de Contraseñas */}
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-library-dark/80">
                    Create Password*
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="Minimum 8 characters"
                        type={showPassword ? "text" : "password"}
                        className="h-14 rounded-xl border-library-dark/20 pr-16 focus:ring-2 focus:ring-antique-gold/50 text-library-dark placeholder:text-library-dark/40 hover:border-library-dark/30 transition-all"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-10 w-10 text-library-dark/40 hover:bg-antique-gold/10 group-hover:text-library-dark"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeClosed className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600/90 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-library-dark/80">
                    Confirm Password*
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="Re-enter your password"
                        type={showPassword ? "text" : "password"}
                        className="h-14 rounded-xl border-library-dark/20 pr-16 focus:ring-2 focus:ring-antique-gold/50 text-library-dark placeholder:text-library-dark/40 hover:border-library-dark/30 transition-all"
                        {...field}
                      />
                      <ShieldCheck className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-library-dark/40 group-focus-within:text-antique-gold" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-600/90 text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Términos y Condiciones */}
          <div className="flex items-center space-x-3 justify-center">
            <Checkbox
              onCheckedChange={() => setChecked(!checked)}
              id="terms"
              className="h-5 w-5 bg-gray-400 shadow shadow-gray-400 border-library-dark/30 data-[state=checked]:bg-antique-gold text-black"
            />
            <label htmlFor="terms" className="text-sm text-library-dark/80">
              I agree to the{" "}
              <Link
                href="#"
                className="text-antique-gold hover:text-library-dark underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-antique-gold hover:text-library-dark underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Botón de Registro */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-gradient-to-br from-antique-gold/90 to-library-dark/90 hover:from-antique-gold hover:to-library-dark text-lg font-medium text-antique-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            {loading && (
              <>
                <div className="absolute inset-0 bg-library-dark/20" />
                <Loader2 className="h-6 w-6 animate-spin absolute left-6" />
              </>
            )}
            {loading ? "Creating Account..." : "Join the Library"}
          </Button>

          {/* Mensaje de Error */}
          {errorMessage && (
            <div className="bg-red-50/80 p-4 rounded-xl border border-red-100 flex items-start gap-3 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-red-600/90 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-600/90 leading-tight">
                {errorMessage}
              </span>
            </div>
          )}

          {/* Enlace de Login */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-library-dark/20" />
              </div>
              <span className="relative px-4 bg-ivory-50 text-sm text-library-dark/60">
                Already a member?
              </span>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center w-full h-12 rounded-xl border-2 border-library-dark/20 text-library-dark hover:border-antique-gold/50 hover:text-antique-gold transition-all font-medium gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Access Your Account
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterPage;
