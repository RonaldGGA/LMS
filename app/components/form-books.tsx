"use client";

import React from "react";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
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
import CardBooks from "./card-books";
import { useForm } from "react-hook-form";
import { bookSchema } from "@/zod-schemas";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createBook } from "@/actions/createBooks";

const FormBooks = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      book_name: "",
      author: "",
      category: "",
      price: "",
      img: "",
      description: "",
      // pin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = bookSchema.safeParse(values);
    toast("Clicked");
    if (!result.success) {
      toast("Something went wrong");
      router.refresh();
    } else {
      // Create the new book
      const res = await createBook(values);
      if (res?.success) {
        router.refresh();
        toast.success("Book added correctly");
      } else {
        console.log(res?.error);
        router.refresh();
      }
    }
    console.log(values);
  };
  return (
    <CardBooks
      type="add"
      footerText="Please, the book must be in the physical library"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="book_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book name*</FormLabel>
                <FormControl>
                  <Input placeholder="Harry Potter ..." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Joanne Rowling" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Fiction" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price $USD</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin</FormLabel>
                <FormControl>
                  <InputOTP pattern="^[0-9]+$" maxLength={4} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please, provide the security code given by an admin.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type="submit" variant={"outline"}>
            Add book
          </Button>
        </form>
      </Form>
    </CardBooks>
  );
};

export default FormBooks;
