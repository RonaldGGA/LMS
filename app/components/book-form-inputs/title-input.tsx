"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BookOpen, AlertCircle } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { BookFormValues } from "@/types";

const TitleInput = ({ form }: { form: UseFormReturn<BookFormValues> }) => {
  const titleValue = form.watch("title");
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-ivory-50/80 group-focus-within:text-golden-amber transition-colors">
              Book Title *
            </Label>

            <FormControl>
              <motion.div
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                className="relative group"
              >
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <BookOpen className="h-5 w-5 text-ivory-50/50 group-focus-within:text-golden-amber transition-colors" />
                </div>

                <Input
                  {...field}
                  className={`pl-10 pr-24 h-12 rounded-lg text-base shadow-sm transition-all  
                    ${
                      fieldState.error
                        ? "border-antique-gold focus:ring-antique-gold"
                        : "border-[#1a2a3a] focus:ring-2 focus:ring-golden-amber/30"
                    }  
                    hover:border-golden-amber/50`}
                  placeholder="Harry Potter and the Philosopher's Stone..."
                  maxLength={100}
                />

                <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                  {fieldState.error && (
                    <AlertCircle className="h-5 w-5 text-antique-gold animate-pulse" />
                  )}
                  <span className="text-sm text-ivory-50/50">
                    {titleValue?.length || 0}/100
                  </span>
                </div>
              </motion.div>
            </FormControl>

            <FormMessage className="flex items-center gap-2 text-sm text-antique-gold">
              {fieldState.error && (
                <>
                  <AlertCircle className="h-4 w-4" />
                  {fieldState.error.message}
                </>
              )}
            </FormMessage>
          </div>
        </FormItem>
      )}
    />
  );
};

export default TitleInput;
