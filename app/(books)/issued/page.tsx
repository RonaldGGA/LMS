"use client";

import { useEffect, useState } from "react";
import { getBorrowedBooksByUser } from "@/data/getBorrowedBooks";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import { useUserSession } from "@/app/hooks/useUserSession";
import { userBorrowedBooks } from "@/types";

interface borrowedBooksProps {
  params: {
    user_id: string;
  };
}

const BorrowedBooks: React.FC<borrowedBooksProps> = ({ params }) => {
  const [userBorrowedBooks, setUserBorrowedBooks] = useState<
    userBorrowedBooks[]
  >([]);
  const userId = useUserSession()?.id;

  useEffect(() => {
    const fetchData = async () => {
      const borrowedBooks = await getBorrowedBooksByUser(
        userId || params.user_id
      );
      if (borrowedBooks?.data && borrowedBooks.data.length > 0) {
        setUserBorrowedBooks(borrowedBooks.data);
      }
    };

    fetchData();
  }, [params.user_id, userId]);

  const calculateDaysLeft = (limitDate: Date) => {
    const now = new Date();
    const differenceInMs = limitDate.getTime() - now.getTime();
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    return differenceInDays;
    console.log(differenceInDays); // This will give you the number of days
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-800 text-gray-100">
      <Table>
        <TableCaption className="text-lg font-semibold">
          List of Issued Books
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Loan Date</TableHead>
            <TableHead>Return Date</TableHead>
            <TableHead>Time-left (days)</TableHead>

            <TableHead className="text-center">Fine ($USD)</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {userBorrowedBooks && userBorrowedBooks.length > 0 ? (
            userBorrowedBooks.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.bookCopy.bookTitle.title.length > 30
                    ? item.bookCopy.bookTitle.title.slice(0, 30) + "..."
                    : item.bookCopy.bookTitle.title}
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {format(new Date(item.loanDate), "yyyy.MM.dd")}
                </TableCell>
                <TableCell>
                  {item.returnDate &&
                    format(
                      new Date(item.returnDate || "Not defined"),
                      "yyyy.MM.dd"
                    )}
                </TableCell>
                <TableCell>
                  {item.returnDate && item.returnDate > new Date(Date.now())
                    ? `${calculateDaysLeft(item.returnDate)}`
                    : item.returnDate?.getDay() == new Date(Date.now()).getDay()
                    ? "Today"
                    : "Completed"}
                </TableCell>
                <TableCell className="text-center">
                  ${parseFloat(item.bookCopy.bookTitle.book_price).toFixed(2)}
                </TableCell>
                <TableCell className="text-center ">
                  <Link
                    href={`/book/${item.bookCopy.bookTitle.id}`}
                    className="bg-blue-300 hover:bg-blue-200 text-gray-800 px-2 py-1 rounded-md transition-colors"
                  >
                    More
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                {userBorrowedBooks === null ? (
                  <div className="text-xl">No books issued so far!</div>
                ) : (
                  <div className="text-xl">Loading...</div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BorrowedBooks;
