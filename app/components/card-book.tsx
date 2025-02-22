import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

interface CardBookProps {
  type?: "ISSUE" | "BOOK";
  id: string;
  title: string;
  img: string | null;
  author?: string;
  categories?: { name: string }[];
  ratings?: { rating: number }[];
  issued_date?: Date;
  returnDate?: Date;
  price: string;
}

const CardBook: React.FC<CardBookProps> = ({
  // type,
  id,
  title,
  img = "",
  author = "unknown",
  categories = [],
  ratings = [],
  price,
  // issued_date = "",
  returnDate = "",
}) => {
  // Improve this further

  const ratingMedia = useMemo(() => {
    // Verificamos que bookInfo y bookInfo.ratings existan y tengan elementos
    if (!ratings || ratings.length === 0) {
      return 0;
    }

    // Calculamos el promedio de las calificaciones
    const averageRating =
      ratings.reduce((total, item) => total + item.rating, 0) / ratings.length;

    // Devolvemos el promedio con dos decimales
    return Number(averageRating.toFixed(2));
  }, [ratings]); // Asegúrate de incluir todas las dependencias

  return (
    <Card className="w-[300px]  lg:rounded overflow-hidden shadow-md shadow-white">
      <CardHeader className="bg-gray-800 text-white p-4">
        <CardTitle className="text-xl font-bold text-clip  text-nowrap">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex ">
        <div className="flex gap-5  flex-row justify-center w-full">
          <div className="flex items-center  w-full  justify-center">
            <Image
              src={img && img.length ? img : "/default.webp"}
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

            <p className="text-gray-700 text-base text-nowrap  overflow-hidden flex ">
              Category:{" "}
              <span className="flex gap-1 flex-nowrap">
                {" "}
                {categories && categories.length > 0 ? (
                  categories.slice(0, 1).map((item, index) => (
                    <Badge className="bg-gray-700" key={index}>
                      {item.name.length > 10
                        ? item.name.slice(0, 5).concat("...")
                        : item.name}
                    </Badge>
                  ))
                ) : (
                  <span>No categories</span>
                )}
              </span>
            </p>

            <p className="text-gray-700 text-base text-nowrap">
              Rating: {ratingMedia} / 5
            </p>
            {price ? (
              <p className="text-gray-700 text-base text-nowrap">
                Bail: $ {parseFloat(price).toFixed(2)}
              </p>
            ) : returnDate ? (
              <p className="text-gray-700 text-base text-nowrap ">
                Return: {format(new Date(returnDate), "yyyy-MM-dd")}
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
