"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DollarSign, AlertCircle } from "lucide-react";
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

const PriceInput = ({ form }: { form: UseFormReturn<BookFormValues> }) => {
  return (
    <FormField
      control={form.control}
      name="price"
      render={({ fieldState }) => (
        <FormItem>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-ivory-50/80 group-focus-within:text-antique-gold transition-colors">
              Price (USD)
            </Label>

            <FormControl>
              <motion.div
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
                className="relative group"
              >
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <DollarSign className="h-5 w-5 text-ivory-50/50 group-focus-within:text-antique-gold transition-colors" />
                </div>

                <Input
                  {...form.register("price", {
                    setValueAs: Number,
                  })}
                  type="number"
                  placeholder="0.00"
                  className={`pl-10 pr-10 md:mt-[40px] w-full h-12 rounded-lg text-base shadow-sm transition-all  
                    ${
                      fieldState.error
                        ? "border-golden-amber focus:ring-golden-amber"
                        : "border-library-dark focus:ring-2 focus:ring-antique-gold/30"
                    }  
                    hover:border-antique-gold/50`}
                  inputMode="decimal"
                />

                <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                  {fieldState.error && (
                    <AlertCircle className="h-5 w-5 text-golden-amber animate-pulse" />
                  )}

                  <span className="text-sm text-ivory-50/50">USD</span>
                </div>
              </motion.div>
            </FormControl>

            <FormMessage className="flex items-center gap-2 text-sm text-golden-amber">
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

export default PriceInput;
