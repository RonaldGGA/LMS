"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookSchema } from "@/zod-schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createBook } from "@/actions/createBooks";
import { getCategories } from "@/data/getCategories";
import AuthorInput from "./author-input";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { BookOpen, DollarSign, Tags, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { CategoryPlus } from "@/types";
import Image from "next/image";
import { dashboardBook } from "../dashboard/books/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./image-upload";

interface FormBooksProps {
  book?: dashboardBook;
  onSuccess?: () => void;
}

const FormBooks: React.FC<FormBooksProps> = ({ book, onSuccess }) => {
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryPlus[] | []>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryPlus[]>(
    []
  );
  const [currentSelectValue, setCurrentSelectValue] = useState("");
  const [authorValue, setAuthorValue] = useState("");

  useEffect(() => {
    if (book?.categories) {
      setSelectedCategories(
        book.categories.map((item) => ({ ...item, isNew: false }))
      );
    }
    if (book?.author.author_name) {
      setAuthorValue(book.author.author_name);
    }
  }, [book]);
  const defaultValues = useMemo(() => {
    return {
      book_name: book?.title || "",
      author: book?.author.author_name || "",
      categories: [],
      price: book?.book_price,
      img: "",
      description: "",
    };
  }, [book]);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    const checkUlClick = (e: MouseEvent) => {
      if (ulRef.current && inputRef.current) {
        if (
          (e.target as HTMLElement) !== ulRef.current &&
          (e.target as HTMLElement) !== inputRef.current
        ) {
          setShow(false);
        }
      }
    };

    document.addEventListener("click", checkUlClick);
    console.log("clicked");
    return () => {
      document.removeEventListener("click", checkUlClick);
    };
  });

  useEffect(() => {
    const searchCategories = async () => {
      try {
        const res = await getCategories(currentSelectValue);
        if (res?.success && res.data) {
          const data = res.data.map((item) => ({ ...item, isNew: false }));
          setCategories(data);
        } else {
          if (res && res?.error) {
            toast.error(res.error);
          }
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    searchCategories();
  }, [currentSelectValue]);

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    values.categories = selectedCategories.map((item) => item.id);
    console.log(selectedCategories);
    const result = bookSchema.safeParse(values);
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }
    // create the book
    toast("Clicked");

    // IMPROVE THE COPIES MANAGEMENT; MORE lESS NAME-AUTHOR SPECIFIC
    if (!book) {
      const res = await createBook(values, selectedCategories);
      if (res?.success) {
        router.refresh();
        toast.success("Book added correctly");
        if (onSuccess) {
          onSuccess();
        } else router.push("/");
      } else {
        toast.error(res?.error || "Something happened creting the book");
        console.log(res?.error);
        router.refresh();
      }
    } else {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: values.book_name,
          author: values.author,
          img: values.img,
          price: values.price,
          categories: selectedCategories,
        }),
      });
      const data = await res.json();
      console.log({ DATA: data });

      if (!res.ok) {
        console.log(res);
        toast.error("Error updating the book");
      } else {
        toast.success("Book updated");
        if (onSuccess) {
          onSuccess();
        }
      }
    }
  };

  const bookValue = form.watch("book_name");

  const handleCategoriesChange = (value: CategoryPlus) => {
    console.log(value);
    if (selectedCategories.length > 7) {
      toast.error("Maximun categories of 7");
      setShow(false);
      return;
    }
    setSelectedCategories((prev) => [...prev, value]);
    setShow(false);
  };

  const [show, setShow] = useState(false);

  const handleCategoryWrite = (value: string) => {
    setCurrentSelectValue(value);
  };

  const addNewCategory = (value: string) => {
    if (!value) {
      return;
    } else if (
      selectedCategories.find(
        (item) => item.name.toLowerCase() == value.toLowerCase()
      )
    ) {
      toast("Category already added");
      setCurrentSelectValue("");
      return;
    }
    setSelectedCategories((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: value,
        isNew: true,
      },
    ]);
    setCurrentSelectValue("");
    toast("New category added");
  };

  const handleRemoveCategory = (category: CategoryPlus) => {
    setSelectedCategories(
      selectedCategories.filter((item) => item.id !== category.id)
    );
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-100 w-full">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          {book ? "Edit Book" : "Add New Book"}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Book Name */}
            <FormField
              control={form.control}
              name="book_name"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-700">Book Title *</Label>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 rounded-lg"
                      placeholder="Harry Potter and the Philosopher's Stone"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-700">Cover Image *</Label>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {field.value && (
                        <div className="relative group w-48 h-48 rounded-xl overflow-hidden border-2 border-dashed border-gray-200">
                          <Image
                            src={field.value}
                            alt="Book cover"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => form.setValue("img", "")}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
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
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Author Input */}
            <AuthorInput
              bookValue={bookValue}
              form={form}
              authorValue={authorValue}
              setAuthorValue={setAuthorValue}
            />

            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-gray-700 flex items-center gap-2">
                <Tags className="w-5 h-5 text-blue-600" />
                Categories *
              </Label>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="pl-3 pr-1 py-1 rounded-lg"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      value={currentSelectValue}
                      onChange={(e) => handleCategoryWrite(e.target.value)}
                      placeholder="Search or add categories..."
                      className="h-12 rounded-lg"
                      onFocus={() => setShow(true)}
                    />

                    {show && (
                      <ul
                        ref={ulRef}
                        className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                      >
                        {categories.length === 0 ? (
                          <li className="p-3 text-gray-500 text-sm">
                            No categories found
                          </li>
                        ) : (
                          categories
                            .filter(
                              (category) =>
                                !selectedCategories.some(
                                  (item) => item.id === category.id
                                )
                            )
                            .map((category) => (
                              <li
                                key={category.id}
                                onClick={() => handleCategoriesChange(category)}
                                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                {category.name}
                              </li>
                            ))
                        )}
                      </ul>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => addNewCategory(currentSelectValue)}
                  >
                    Add New
                  </Button>
                </div>
              </div>
            </div>

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Price (USD)
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-12 rounded-lg"
                      placeholder="19.99"
                      type="number"
                      step="0.01"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {book ? "Update Book" : "Add Book"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormBooks;
