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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createBook } from "@/actions/createBooks";
import { Category } from "@prisma/client";
import { getCategories } from "@/data/getCategories";
import AuthorInput from "./author-input";
import z from "zod";
const FormBooks = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[] | null>(null);

  const [authorValue, setAuthorValue] = useState("");

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
  }, []);

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = bookSchema.safeParse(values);

    if (isInputMode && values.category) {
      const newCategory = { id: String(Date.now()), cat_type: values.category };
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

  const bookValue = form.watch("book_name");
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
          <AuthorInput
            bookValue={bookValue}
            form={form}
            authorValue={authorValue}
            setAuthorValue={setAuthorValue}
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
                        </SelectContent>
                      </Select>
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
          <Button type="submit" variant={"outline"}>
            Add book
          </Button>
        </form>
      </Form>
    </CardBooks>
  );
};

export default FormBooks;
