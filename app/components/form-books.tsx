"use client";

import React, { useEffect, useRef, useState } from "react";

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
import { getCategories } from "@/data/getCategories";
import AuthorInput from "./author-input";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";
import { CategoryPlus } from "@/types";
import { createCategoriesPlus } from "@/actions/create-categories";

const FormBooks = () => {
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryPlus[] | []>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryPlus[]>(
    []
  );
  const [authorValue, setAuthorValue] = useState("");

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      book_name: "",
      author: "",
      categories: [],
      price: "0",
      img: "",
      description: "",
    },
  });

  useEffect(() => {
    const checkUlClick = (e: MouseEvent) => {
      if (ulRef.current && inputRef.current) {
        if (
          (e.target as HTMLElement).id !== ulRef.current.id &&
          (e.target as HTMLElement).id !== inputRef.current.id
        ) {
          setShow(false);
        }
      }
    };

    document.addEventListener("click", checkUlClick);

    return () => {
      document.removeEventListener("click", checkUlClick);
    };
  }, []);

  useEffect(() => {
    const searchCategories = async () => {
      try {
        const res = await getCategories();
        if (res?.success && res.data) {
          const data = res.data.map((item) => ({ ...item, isNew: false }));
          setCategories(data);
        }
        console.log({ CATEGORIES: categories });
      } catch (error) {
        console.log(error);
      }
    };
    searchCategories();
  }, []);

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    values.categories = selectedCategories.map((item) => item.id);
    console.log(selectedCategories);
    const result = bookSchema.safeParse(values);
    if (!result.success) {
      toast.error(result.error.message);
      return;
    }
    // Create the categories added
    try {
      const newCategories = selectedCategories.filter(
        (item) => item.isNew === true
      );
      console.log(newCategories);
      if (newCategories.length > 0) {
        const result = await createCategoriesPlus(newCategories);
        if (!result.success) {
          toast.error("something happened with the categories");
          return;
        }
        toast.success("Categories added correctly");
      }
    } catch (error) {
      console.log(error);
      return;
    }

    // create the book with all the categories added

    // create the book
    toast("Clicked");
    console.log({ VALUES: values });

    const res = await createBook(values);
    if (res?.success) {
      router.refresh();
      toast.success("Book added correctly");
    } else {
      console.log(res?.error);
      router.refresh();
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
  };

  const [show, setShow] = useState(false);

  const handleSelectClick = () => {
    setShow(true);
  };
  const [currentSelectValue, setCurrentSelectValue] = useState("");
  const handleCategoryWrite = (value: string) => {
    setCurrentSelectValue(value);
  };

  const addNewCategory = (value: string) => {
    if (!value) {
      return;
    } else if (
      selectedCategories.find(
        (item) => item.cat_type.toLowerCase() == value.toLowerCase()
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
        cat_type: value,
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

          <div className="flex items-end gap-2">
            <FormField
              name="categories"
              render={() => (
                <>
                  <FormItem>
                    <FormControl>
                      <div>
                        {/* SELECTED CATEGORIES */}
                        <ul
                          className="flex items-center  gap-1 max-w-[250px] overflow-auto p-2 "
                          onClick={handleSelectClick}
                        >
                          {selectedCategories &&
                            selectedCategories.map((item) => (
                              <li
                                key={item.id}
                                className="cursor-pointer"
                                onClick={() => handleRemoveCategory(item)}
                              >
                                <Badge className="p-1 gap-1 text-xs tracking-wider text-gray-300">
                                  {item.cat_type} <X width={15} height={15} />
                                </Badge>
                              </li>
                            ))}
                        </ul>
                        {/* INPUT TO HOLD THE VALUES AND WRITE THE NEW ONE */}
                        <div className="flex items-center gap-2">
                          <Input
                            className="border border-gray-400"
                            autoComplete="off"
                            id="category-input"
                            ref={inputRef}
                            value={currentSelectValue}
                            onChange={(e) =>
                              handleCategoryWrite(e.target.value)
                            }
                            placeholder="select categories..."
                            onFocus={() => setShow(true)}
                          />
                          <Button
                            variant={"secondary"}
                            className="border border-blue-500 hover:bg-blue-100 transition hover:border-black"
                            onClick={() => addNewCategory(currentSelectValue)}
                            type="button"
                          >
                            Add
                          </Button>
                        </div>

                        {/* CATEGORIES OPTIONS TO CLICK AND ADD */}
                        {show && (
                          <ul
                            id="category-suggestions"
                            ref={ulRef}
                            className="absolute mt-2 bg-gray-100 max-h-[200px] w-[215px] overflow-auto shadow rounded shadow-gray-400"
                          >
                            {categories &&
                              categories
                                .filter(
                                  (item) =>
                                    !selectedCategories.find(
                                      (singleCategory) =>
                                        singleCategory.id == item.id ||
                                        singleCategory.cat_type.toLowerCase() ==
                                          item.cat_type.toLowerCase()
                                    )
                                )
                                .map((category) => (
                                  <>
                                    <li
                                      className="p-2 hover:border-l hover:border-l-blue-500 border-l border-l-white cursor-pointer hover:bg-gray-200 transition-all"
                                      onClick={() =>
                                        handleCategoriesChange(category)
                                      }
                                      key={category.id}
                                    >
                                      {category.cat_type}
                                    </li>
                                    <Separator />
                                  </>
                                ))}
                          </ul>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>

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
