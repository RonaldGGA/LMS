"use client";

import { authenticate } from "@/actions/sign-in";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  BookOpen,
  Eye,
  EyeClosed,
  LibrarySquare,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    const res = await authenticate(values);
    if (res) {
      setErrorMessage(res);
    } else {
      setErrorMessage("");
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex bg-library-dark/5 p-4 rounded-2xl">
          <BookOpen className="h-12 w-12 text-library-dark" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-library-dark">
          Welcome to Library Hub
        </h1>
        <p className="text-lg text-library-dark/80">
          Access your digital library-managment account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-library-dark/80">
                  Library ID / Username
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="Enter your library ID"
                      className="h-14 rounded-xl border-library-dark/20 focus:ring-2 focus:ring-antique-gold/50 text-library-dark placeholder:text-library-dark/40 hover:border-library-dark/30 transition-all"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600/90 text-sm" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel className="text-sm font-medium text-library-dark/80">
                    Password
                  </FormLabel>
                  <Link
                    aria-disabled={true}
                    href="#"
                    className="aria-disabled:cursor-no-allowed aria-disabled:text-muted-foreground text-sm text-antique-gold hover:text-library-dark transition-colors"
                  >
                    Forgot Password? (ToDo)
                  </Link>
                </div>
                <FormControl>
                  <div className="relative group">
                    <Input
                      placeholder="••••••••"
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
            {loading ? "Authenticating..." : "Access Library"}
          </Button>

          {errorMessage && (
            <div className="bg-red-50/80 p-4 rounded-xl border border-red-100 flex items-start gap-3 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 text-red-600/90 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-600/90 leading-tight">
                {errorMessage}
              </span>
            </div>
          )}

          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-library-dark/20" />
              </div>
              <span className="relative px-4 bg-ivory-50 text-sm text-library-dark/60">
                New to our library?
              </span>
            </div>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center w-full h-12 rounded-xl border-2 border-library-dark/20 text-library-dark hover:border-antique-gold/50 hover:text-antique-gold transition-all font-medium gap-2"
            >
              <LibrarySquare className="h-5 w-5" />
              Create Library Account
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
