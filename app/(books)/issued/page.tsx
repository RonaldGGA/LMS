"use client";

import { useEffect, useState } from "react";
import { getBorrowedBooksByUser } from "@/data/getBorrowedBooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";
import { useUserSession } from "@/app/hooks/useUserSession";
import { userBorrowedBooks } from "@/types";
import { AlertCircle, Badge, Clock, Loader2 } from "lucide-react";

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
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const borrowedBooks = await getBorrowedBooksByUser(
          userId || params.user_id
        );
        if (borrowedBooks?.data && borrowedBooks.data.length > 0) {
          setUserBorrowedBooks(borrowedBooks.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, [params.user_id, userId]);

  // const calculateDaysLeft = (limitDate: Date) => {
  //   const now = new Date();
  //   const differenceInMs = limitDate.getTime() - now.getTime();
  //   const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  //   return differenceInDays;
  //   console.log(differenceInDays); // This will give you the number of days
  // };

  const statusVariant = (status: string) => {
    switch (status) {
      case "ISSUED":
        return "default";
      case "OVERDUE":
        return "destructive";
      case "RETURNED":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-6 flex items-center gap-3">
        <AlertCircle className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">Your Loans</h1>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <Table className="border-collapse">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[30%] text-gray-600 font-medium">
                Title
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Status
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Loan Date
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Return Date
              </TableHead>
              <TableHead className="text-gray-600 font-medium">
                Days Remaining
              </TableHead>
              <TableHead className="text-center text-gray-600 font-medium">
                Price
              </TableHead>
              <TableHead className="text-center text-gray-600 font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {userBorrowedBooks?.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {item.bookCopy.bookTitle.title}
                </TableCell>
                <TableCell>
                  <Badge fontVariant={statusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {format(new Date(item.loanDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-gray-600">
                  {item.returnDate
                    ? format(new Date(item.returnDate), "MMM dd, yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  {/* <span
                    className={`font-medium ${
                      calculateDaysLeft(item.returnDate |) <= 3
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                  }
                
                    {item.returnDate
                      ? `${calculateDaysLeft(item.returnDate)} days`
                      : "N/A"}
                  </span> */}
                  TODO
                </TableCell>
                <TableCell className="text-center text-gray-600">
                  ${parseFloat(item.bookCopy.bookTitle.book_price).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Link
                    href={`/book/${item.bookCopy.bookTitle.id}`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg transition-colors"
                  >
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!loading && userBorrowedBooks.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <Clock className="w-12 h-12 text-gray-400" />
              <p className="text-gray-600">No active book loans</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;
