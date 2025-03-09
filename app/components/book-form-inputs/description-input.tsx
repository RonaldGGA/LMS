import React, { useEffect, useRef } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { bookSchema } from "@/zod-schemas";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

export type BookFormValues = z.infer<typeof bookSchema>;
const DescriptionInput = ({
  form,
}: {
  form: UseFormReturn<BookFormValues>;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const value = form.watch("description");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <Label className="text-ivory-50">Description *</Label>
          <span className="text-antique-gold text-sm font-normal ml-2">
            {value?.length || 0}/5000
          </span>
          <FormControl>
            <div className="relative">
              <Textarea
                {...field}
                ref={textareaRef}
                className="min-h-[120px] w-full resize-y transition-all duration-200  
            rounded-lg border-library-dark focus:border-library-midnight hover:border-library-midnightfocus:ring-2 focus:ring-golden-amber 
            overflow-hidden bg-library-dark dark:border-library-dark dark:hover:border-library-midnight"
                placeholder="A magical adventure about..."
                style={{
                  minHeight: "120px",
                  maxHeight: "400px",
                }}
              />
            </div>
          </FormControl>
          <FormMessage className="text-[#c2a878] text-sm" />
        </FormItem>
      )}
    />
  );
};

export default DescriptionInput;
