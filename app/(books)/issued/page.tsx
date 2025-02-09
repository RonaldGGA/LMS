import { getIssuedBooks } from "@/data/getIssuedBooks";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

interface IssuedBooksProps {
  params: {
    user_id: string;
  };
}
const IssuedBooks: React.FC<IssuedBooksProps> = async ({ params }) => {
  const searchedBooks = await getIssuedBooks(params.user_id);
  console.log({ SEARCHED: searchedBooks });

  return (
    <Table className="overflow-hidden scroll-m-0 max-w-[95%] p-4 mx-auto mt-10 bg-white rounded text-black">
      <TableCaption>A list of your issued books.</TableCaption>
      <TableHeader>
        <TableRow className="">
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Actual Status</TableHead>
          <TableHead>Issued Date</TableHead>
          <TableHead>Return Date</TableHead>
          <TableHead>Fine ($USD)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="">
        {searchedBooks?.success &&
        searchedBooks.data &&
        searchedBooks?.data?.length > 0 ? (
          searchedBooks?.data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.book.book_name && item.book.book_name.length > 10
                  ? item.book.book_name.split("").slice(0, 15).join("").trim() +
                    "..."
                  : item.book.book_name}
              </TableCell>
              <TableCell className="">
                {item.book.ratings.reduce(
                  (total, value) => total + value.rating,
                  0
                ) / item.book.ratings.length}
                /5
              </TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell className="">
                {format(new Date(item.issued_date), "yyy.MM.dd")}
              </TableCell>
              <TableCell className="">
                {format(new Date(item.return_date), "yyy.MM.dd")}
              </TableCell>
              <TableCell className="text-center">
                {item.book.book_price}
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={`/book/${item.book.id}`}
                  className="bg-blue-50 hover:bg-blue-100 text-gray-600 font-bold p-2 transition-colors  rounded"
                >
                  More
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : searchedBooks?.success && searchedBooks.data?.length === 0 ? (
          <div className="w-[250px] text-lg p-3">No books issued so far !</div>
        ) : (
          <div className="text-xl text-center ">Loading...</div>
        )}
      </TableBody>
    </Table>
  );
};

export default IssuedBooks;
