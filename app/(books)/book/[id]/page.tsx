"use client";

import { getBookById } from "@/data/getBook";
import { BookStatus } from "@prisma/client";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BigBook } from "@/types";
import toast from "react-hot-toast";

import { issueBook } from "@/actions/issue-book";
import { useUserSession } from "@/app/hooks/useUserSession";
import Confirmation from "@/app/components/issue-confirmation";
import { returnBook } from "@/actions/return-book";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ratingSchema } from "@/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import z from "zod";
import { addRating } from "@/actions/add-rating";

const SingleBookPage = ({ params }: { params: { id: string } }) => {
  const [pickedStars, setPickedStars] = useState(0);
  const [reload, setReload] = useState(false);

  const [bookInfo, setBookInfo] = useState<BigBook | null>(null);
  const [issuedByUser, setIssuedByUser] = useState(false);
  console.log(params);
  const userId = useUserSession();
  const getBook = useCallback(async () => {
    try {
      console.log(`getting book with id ${params.id}`);
      const result = await getBookById(params.id);

      if (!result?.success) {
        setBookInfo(null);
        console.log({ BOOKID: result?.error });
        return;
      }

      setBookInfo(result.data);
      console.log("Got the book");
    } catch (error) {
      console.log(error);
    }

    //TODO: handle this more properly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, reload]); // Dependency on params.id
  useEffect(() => {
    getBook();
  }, [getBook]);

  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
    },
  });

  useEffect(() => {
    if (bookInfo && userId) {
      const issued = bookInfo.issuedBooks.some(
        (issuedBook) =>
          issuedBook.user_id === userId &&
          new Date(issuedBook.return_date) > new Date(Date.now())
      );
      setIssuedByUser(issued);
      console.log("Issued by user:", issued);
    }
  }, [bookInfo, userId]); // Only run this effect when bookInfo or userId changes

  const ratingMedia = useMemo(() => {
    // Verificamos que bookInfo y bookInfo.ratings existan y tengan elementos
    if (!bookInfo || !bookInfo.ratings || bookInfo.ratings.length === 0) {
      return 0;
    }

    // Calculamos el promedio de las calificaciones
    const averageRating =
      bookInfo.ratings.reduce((total, item) => total + item.rating, 0) /
      bookInfo.ratings.length;

    // Devolvemos el promedio con dos decimales
    return Number(averageRating.toFixed(2));
  }, [bookInfo]); // Asegúrate de incluir todas las dependencias

  if (!userId) {
    return null;
  }
  if (!userId) {
    return null;
  }

  // check if the book is an issued book, and it is issued by the current user
  // if so, give it the oportunity to return it
  // if not just give the normal information

  const handleIssueBook = async () => {
    // Logic for issuing the book, e.g., updating the status in the database
    console.log("Issuing the book...");
    toast(`Issuing the book with the id ${params.id}`);
    const result = await issueBook(params.id);
    if (result?.success) {
      toast.success("Book issued succesfully");
      window.location.reload();
    } else {
      toast.error("Book coulnt be issued, something happpened");
    }
  };
  const handleReturnBook = async () => {
    console.log("Returning the book...");
    toast(`Returning the book with the id ${params.id}`);
    const result = await returnBook(params.id);
    if (result?.success) {
      toast.success("Book returned succesfully");
      window.location.reload();
    } else {
      toast.error("Book coulnt be returned, something happpened");
    }
  };
  if (!bookInfo) {
    return null;
  }
  console.log(bookInfo);

  const onSubmit = async (values: z.infer<typeof ratingSchema>) => {
    try {
      const result = await addRating({
        userId,
        userRating: values.rating,
        bookId: bookInfo.id,
      });
      if (!result.success) {
        toast.error("Something happened adding the rating");
      } else {
        toast.success("Rating added correctly");
        setReload((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error ocurred");
    }
  };
  const handleStarsPicked = (starNumber: number) => {
    if (pickedStars == 1 && starNumber == 1) {
      setPickedStars(0);
      form.setValue("rating", 0);
    } else {
      setPickedStars(starNumber);
      form.setValue("rating", starNumber);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="shadow-lg rounded-lg w-full flex flex-col lg:flex-row p-8 bg-white">
        <div className="flex-shrink-0">
          <Image
            width={200}
            height={300}
            alt={bookInfo?.book_name}
            src={bookInfo?.img ? bookInfo.img : "/default.webp"}
            className="rounded-lg"
          />
        </div>
        <div className="flex-grow mt-4 lg:mt-0 lg:ml-6">
          <h2 className="text-3xl font-bold capitalize">
            {bookInfo?.book_name}
          </h2>
          <p className="text-gray-600">Author: {bookInfo.author.author_name}</p>
          <div className="text-gray-600 my-2 flex items-center gap-1">
            Categories:{" "}
            {bookInfo?.categories && bookInfo.categories.length > 0 ? (
              bookInfo.categories.map((item, index) => {
                console.log(`your item is ${item.category.cat_type}`);
                return (
                  <Badge
                    className="p-2 tracking-widest bg-gray-700"
                    key={index}
                  >
                    {item.category.cat_type}{" "}
                  </Badge>
                );
              })
            ) : (
              <span>No categories available</span>
            )}
          </div>
          <p className="text-lg font-semibold text-green-600">
            Fine-Price: ${parseFloat(bookInfo.book_price).toFixed(2)}
          </p>
          <div className="flex items-center">
            <p className="text-lg font-semibold">Rating: {ratingMedia}/5</p>
            <span className="ml-2 text-yellow-500 flex">
              {/* {[...Array(Math.round(ratingMedia))].map((_, i) => (
                <StarIcon fill="yellow" width={20} key={i} color="black" />
              ))}
              {[...Array(5 - Math.round(ratingMedia))].map((_, i) => (
                <StarIcon key={i} color="black" width={20} fill="" />
              ))} */}
            </span>

            <Dialog>
              <DialogTrigger className="p-1 shadow shadow-gray-400 hover:bg-gray-500 transition-colors rounded">
                Rate it!
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>What do you think about this book?</DialogTitle>
                  <DialogDescription>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        <FormField
                          control={form.control}
                          name="rating"
                          render={() => (
                            <FormItem>
                              <FormLabel>Rating</FormLabel>
                              <FormControl className="flex flex-col gap-2">
                                <>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => {
                                      if (i + 1 > pickedStars) {
                                        return (
                                          <StarIcon
                                            fill=""
                                            width={20}
                                            key={i}
                                            color="black"
                                            onClick={() =>
                                              handleStarsPicked(i + 1)
                                            }
                                          />
                                        );
                                      } else {
                                        return (
                                          <StarIcon
                                            fill="yellow"
                                            width={20}
                                            key={i}
                                            color="black"
                                            onClick={() =>
                                              handleStarsPicked(i + 1)
                                            }
                                          />
                                        );
                                      }
                                    })}
                                  </div>
                                  <Badge>{pickedStars}/5</Badge>
                                  <DialogFooter className="text-md text-black p-3">
                                    <DialogClose>
                                      <Button type="submit">Save</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </>
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <p className="mt-2 text-gray-700">{bookInfo.description}</p>
          <p
            className={`mt-2 font-semibold ${
              bookInfo.book_status == BookStatus.ISSUED
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {bookInfo.book_status == BookStatus.ISSUED
              ? "Status: Issued"
              : "Status: Available"}
          </p>
          <div className="flex items-center gap-4">
            <Confirmation
              bookInfo={bookInfo}
              handleIssueBook={handleIssueBook}
            />
            {issuedByUser && (
              <Confirmation
                type={issuedByUser ? BookStatus.ISSUED : BookStatus.IN_STOCK}
                bookInfo={bookInfo}
                handleReturnBook={handleReturnBook}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
