"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bookSchema } from "@/zod-schemas";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createBook } from "@/actions/createBooks";
import z from "zod";
import { AlertCircle, BookOpen, Loader2, PlusCircle, Save } from "lucide-react";
import { CategoryPlus } from "@/types";
import { dashboardBook } from "../dashboard/books/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TitleInput from "./book-form-inputs/title-input";
import ImageInput from "./book-form-inputs/image-input";
import CategoriesInput from "./book-form-inputs/categories-input";
import PriceInput from "./book-form-inputs/price-input";
import DescriptionInput from "./book-form-inputs/description-input";
import AuthorInput from "./book-form-inputs/author-input";
import { DialogClose } from "@/components/ui/dialog";

interface FormBooksProps {
  book?: dashboardBook;
  onSuccess?: () => void;
}

const FormBooks: React.FC<FormBooksProps> = ({ book, onSuccess }) => {
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<CategoryPlus[]>(
    [],
  );
  const [isSubmiting, setIsSubmiting] = useState(false);

  useEffect(() => {
    if (book?.categories) {
      setSelectedCategories(
        book.categories.map((item) => ({ ...item, isNew: false })),
      );
    }
  }, [book]);

  const defaultValues = useMemo(() => {
    return {
      title: book?.title || "",
      author: book?.author.author_name || "",
      categories: book?.categories || [],
      price: book?.book_price ? parseFloat(book?.book_price) : 0,
      img: book?.img || "",
      description: book?.description || "",
    };
  }, [book]);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const { data, error, success } = bookSchema.safeParse(values);
    if (!success) {
      toast.error(error.message);
      return;
    }

    try {
      setIsSubmiting(true);
      if (!book) {
        const res = await createBook(data);
        if (res?.success) {
          router.refresh();
          toast.success("Book added correctly");
          router.push("/");
        } else {
          toast.error(res?.error || "Something happened creting the book");
          console.log(res?.error);
          router.refresh();
        }
      } else {
        const res = await fetch(`/api/books/${book.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: values.title,
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
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Card className="w-full mx-auto bg-library-dark text-ivory-50 shadow-lg border border-library-midnight rounded-xl hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b border-library-midnight bg-gradient-to-r from-library-midnight to-library-dark">
        <CardTitle className="text-3xl font-bold flex items-center gap-3 px-2">
          <BookOpen className="w-7 h-7 text-golden-amber" />
          <div className="flex flex-col">
            <span>{book ? "Edit Book" : "Add New Book"}</span>
            <span className="text-sm font-normal text-antique-gold mt-1">
              {book ? "Update book details" : "Create new book entry"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ImageInput form={form} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <TitleInput form={form} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <PriceInput form={form} />
                </motion.div>
              </div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <AuthorInput form={form} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <CategoriesInput
                    form={form}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <DescriptionInput form={form} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center border-t border-library-midnight pt-6">
                {book && (
                  <DialogClose asChild>
                    <Button className="w-full md:w-auto h-14 px-11 py-6 hover:opacity-95 text-ivory-50 font-semibold shadow-lg hover:shadow-xl transition-all">
                      Cancel
                    </Button>
                  </DialogClose>
                )}
                <Button
                  type="submit"
                  disabled={isSubmiting}
                  className="w-full md:w-auto h-14 bg-golden-amber hover:bg-antique-gold text-library-dark font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmiting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      {book ? (
                        <>
                          <Save className="w-5 h-5" />
                          Update Book
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5" />
                          Create Book
                        </>
                      )}
                    </span>
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center">
                {form.formState.errors &&
                  Object.keys(form.formState.errors).length > 0 && (
                    <div className="text-sm text-red-400 flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Please fix {
                        Object.keys(form.formState.errors).length
                      }{" "}
                      errors
                    </div>
                  )}
              </div>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormBooks;
