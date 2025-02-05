import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookStatus } from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardBookProps {
  type?: "ISSUE" | "BOOK";
  id: string;
  title: string;
  img?: string;
  author?: string;
  category?: string;
  rating?: number;
  status?: BookStatus;
  issued_date?: Date;
  return_date?: Date;
}

const CardBook: React.FC<CardBookProps> = ({
  // type,
  id,
  title,
  img = "",
  author = "unknown",
  category = "not-currently",
  rating = 5,
  status,
  // issued_date = "",
  return_date = "",
}) => {
  // Improve this further
  return (
    <Card className="w-[300px]  lg:rounded overflow-hidden shadow-lg">
      <CardHeader className="bg-gray-800 text-white p-4">
        <CardTitle className="text-xl font-bold text-clip  text-nowrap">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex ">
        <div className="flex gap-5 flex-row justify-center w-full">
          <div className="flex items-center w-full  justify-center">
            <Image
              src={img.length ? img : "/default.webp"}
              alt="book_image"
              width={100}
              height={100}
              className="rounded"
            />
          </div>

          <div className="text-wrap ">
            <p className="text-gray-700 text-base text-nowrap overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[170px]">
              Author: {author}
            </p>

            <p className="text-gray-700 text-base text-nowrap">
              Category: {category}
            </p>

            {/* Status or return date */}
            <p className="text-gray-700 text-base text-nowrap">
              Rating: {rating} / 5
            </p>
            {status ? (
              <p className="text-gray-700 text-base text-nowrap">
                Status: {status == BookStatus.IN_STOCK ? "Avaible" : "Taken"}
              </p>
            ) : return_date ? (
              <p className="text-gray-700 text-base text-nowrap ">
                Return: {format(new Date(return_date), "yyyy-MM-dd")}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-100 p-4">
        <Link
          href={`/book/${id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardBook;
