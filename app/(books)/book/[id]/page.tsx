"use client";

import { getBookById } from "@/data/getBook";
import { BookStatus } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Book } from "@prisma/client";
import { BigBook } from "@/types";
import toast from "react-hot-toast";

const SingleBookPage = ({ params }: { params: { id: string } }) => {
  const [bookInfo, setBookInfo] = useState<BigBook | null>(null);
  console.log(params);

  const getBook = async () => {
    try {
      const result = await getBookById(params.id);
      if (result?.success) {
        setBookInfo(result.data);
      }
    } catch (error) {
      if (error) {
        console.log(error);
        return null;
      }
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  const handleIssueBook = () => {
    // Logic for issuing the book, e.g., updating the status in the database
    console.log("Issuing the book...");
    toast("Issuing the book...");
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
          <p className="text-gray-600">
            Category: {bookInfo.category.cat_type}
          </p>
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
          <button
            onClick={handleIssueBook}
            className={`mt-4 px-4 py-2 rounded-md text-white font-semibold ${
              bookInfo.book_status === BookStatus.ISSUED
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={bookInfo.book_status === BookStatus.ISSUED} // Disable button if book is already issued
          >
            {bookInfo.book_status == BookStatus.ISSUED
              ? "Already Issued"
              : "Issue Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleBookPage;
