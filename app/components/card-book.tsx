import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardBookProps {
  id: string;
  title: string;
  img?: string;
  author?: string;
  category?: string;
  rating?: number;
  status: BookStatus;
}

const CardBook: React.FC<CardBookProps> = ({
  id,
  title,
  img = "",
  author = "unknown",
  category = "not-currently",
  rating = 5,
  status,
}) => {
  const onClick = () => {};
  return (
    <Card className="w-[200px] lg:w-[300px] rounded overflow-hidden shadow-lg">
      <CardHeader className="bg-gray-800 text-white p-4">
        <CardTitle className="text-xl font-bold text-clip  text-nowrap">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex ">
        <div className="flex gap-5 flex-col lg:flex-row justify-center w-full">
          <div className="flex items-center w-full lg:max-w-fit justify-center">
            <Image
              src={img.length ? img : "/default.webp"}
              alt="book_image"
              width={100}
              height={100}
              className="rounded"
            />
          </div>

          <div className="text-wrap flex-[2]">
            <p className="text-gray-700 text-base overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[170px]">
              Author: {author}
            </p>
            <p className="text-gray-700 text-base">Category: {category}</p>
            <p className="text-gray-700 text-base">Rating: {rating} / 5</p>
            <p className="text-gray-700 text-base">
              Status: {status == BookStatus.IN_STOCK ? "Avaible" : "Taken"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-100 p-4">
        <Link
          href={`/book/${id}`}
          onClick={onClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardBook;
