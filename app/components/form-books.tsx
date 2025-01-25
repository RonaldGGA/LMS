"use client";

import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createBook } from "@/actions/createBooks";
import { Category } from "@prisma/client";
import { getCategories } from "@/data/getCategories";

const FormBooks = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[] | null>(null);

  const [isInputMode, setInputMode] = useState(false);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      book_name: "",
      author: "",
      category: "",
      price: "0",
      img: "",
      description: "",
      // pin: "",
    },
  });

  useEffect(() => {
    const searchCategories = async () => {
      try {
        const res = await getCategories();
        if (res?.success) {
          setCategories(res.data);
        }
        console.log({ CATEGORIES: categories });
      } catch (error) {
        console.log(error);
      }
    };
    searchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = bookSchema.safeParse(values);

    // Handle new category submission
    if (isInputMode && values.category) {
      // Here you might want to add logic for creating a new category in the database
      const newCategory = { id: String(Date.now()), cat_type: values.category }; // Temporary ID generation
      setCategories((prev) => (prev ? [...prev, newCategory] : [newCategory]));
      toast.success("Category added successfully!");
    }

    toast("Clicked");

    if (!result.success) {
      toast.error("Something went wrong");
      router.refresh();
    } else {
      const res = await createBook(values);
      if (res?.success) {
        router.refresh();
        toast.success("Book added correctly");
      } else {
        console.log(res?.error);
        router.refresh();
      }
    }
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

          {isInputMode ? (
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Category*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter new category"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                onClick={() => setInputMode(false)}
                className=""
                variant={"ghost"}
                type="button"
              >
                Select Category
              </Button>
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories
                            ? categories.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.cat_type}
                                </SelectItem>
                              ))
                            : "Loading"}
                          {/* <SelectItem value={"new"}>New</SelectItem> */}
                        </SelectContent>
                      </Select>

                      {/* <Input placeholder="Fiction" {...field} /> */}
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                onClick={() => setInputMode(true)}
                className="mb-2"
                variant={"ghost"}
                type="button"
              >
                Add Category
              </Button>
            </div>
          )}

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
