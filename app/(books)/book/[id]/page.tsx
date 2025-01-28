"use client";

import { getBookById } from "@/data/getBook";
import { BookStatus } from "@prisma/client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { BigBook } from "@/types";
import toast from "react-hot-toast";

import { issueBook } from "@/actions/issue-book";
import { useUserSession } from "@/app/hooks/useUserSession";
import Confirmation from "@/app/components/issue-confirmation";
import { returnBook } from "@/actions/return-book";
import { Badge } from "@/components/ui/badge";

const SingleBookPage = ({ params }: { params: { id: string } }) => {
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
  }, [params.id]); // Dependency on params.id
  useEffect(() => {
    getBook();
  }, [getBook]);

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
            <p className="text-lg font-semibold">Rating: {bookInfo.rating}</p>
            <span className="ml-2 text-yellow-500">
              {"★".repeat(Math.round(parseFloat(bookInfo.rating)))}
              {"★".repeat(5 - Math.round(parseFloat(bookInfo.rating)))}
            </span>
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
