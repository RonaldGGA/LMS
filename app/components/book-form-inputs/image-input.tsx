import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { ImageUpload } from "../image-upload";
import { X } from "lucide-react";
import Image from "next/image";
import { BookFormValues } from "@/types";

const ImageInput = ({ form }: { form: UseFormReturn<BookFormValues> }) => {
  return (
    <FormField
      control={form.control}
      name="img"
      render={({ field }) => (
        <FormItem className=" ">
          <Label className="text-ivory-50">Cover Image *</Label>
          <FormControl>
            <div className="flex flex-col gap-4">
              {field.value && (
                <div className="relative group w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-antique-gold mx-auto">
                  <Image
                    src={field.value}
                    alt="Book cover"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => form.setValue("img", "")}
                    className="absolute top-2 right-2 bg-golden-amber text-white p-1 rounded-full hover:bg-antique-gold"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <ImageUpload
                onSuccess={(url) => {
                  form.setValue("img", url);
                  form.clearErrors("img");
                }}
                isValue={!!field.value}
              />
            </div>
          </FormControl>
          <FormMessage className="text-antique-gold text-sm" />
        </FormItem>
      )}
    />
  );
};

export default ImageInput;
