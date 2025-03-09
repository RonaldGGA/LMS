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
import { AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { BookLoanStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilteredLoans, setUserFilteredLoans] = useState<
    userBorrowedBooks[]
  >([]);

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

  useEffect(() => {
    const filteredLoans = userBorrowedBooks.filter(
      (loan) =>
        loan.bookCopy.bookTitle.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        loan.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUserFilteredLoans(filteredLoans);
  }, [searchTerm, userBorrowedBooks]);

  const calculateDaysLeft = (
    loanedDate: Date,
    returnDate: Date,
    status: BookLoanStatus
  ) => {
    const now = new Date();
    if (status === "IN_STOCK") {
      return "good";
    }
    if (status === "ISSUED" && returnDate) {
      // Convert dates to timestamps
      const returnTime = returnDate.getTime();
      const nowTime = now.getTime();

      if (returnTime < nowTime) {
        return "Debt";
      }

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysLeft = Math.ceil((returnTime - nowTime) / msPerDay);

      return daysLeft;
    }
    return "N/A";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-ivory-50 rounded-xl shadow-lg border border-golden-amber/20">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-8 h-8 text-golden-amber" />
          <h1 className="text-2xl font-bold text-library-dark">Your Loans</h1>
        </div>
        <Input
          placeholder="Search by title or status..."
          className="max-w-md text-library-dark bg-white border-2 border-golden-amber/30 focus:ring-golden-amber/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-lg border border-golden-amber/20 overflow-hidden">
        <Table className="border-collapse">
          <TableHeader className="bg-golden-amber/10">
            <TableRow>
              {[
                "Title",
                "Status",
                "Loan Date",
                "Return Date",
                "Days Remaining",
                "Price",
                "Actions",
              ].map((header) => (
                <TableHead
                  key={header}
                  className="text-library-dark font-bold text-center"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {userFilteredLoans.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-golden-amber/5 transition-colors"
              >
                <TableCell className="font-medium text-library-dark">
                  {item.bookCopy.bookTitle.title}
                </TableCell>
                <TableCell className="">
                  <Badge
                    className={cn(
                      "text-ivory-50",
                      item.status === "ISSUED"
                        ? "bg-red-500"
                        : item.status === "IN_STOCK"
                        ? "bg-emerald-500"
                        : item.status === "REQUESTED"
                        ? "bg-golden-amber"
                        : "bg-library-dark"
                    )}
                  >
                    {" "}
                    {item.status[0] +
                      item.status.slice(1, item.status.length).toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-library-dark/80">
                  {format(new Date(item.loanDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-library-dark/80">
                  {item.returnDate
                    ? format(new Date(item.returnDate), "MMM dd, yyyy")
                    : "-"}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "font-semibold",
                      typeof calculateDaysLeft(
                        item.loanDate,
                        item.returnDate!,
                        item.status
                      ) === "number"
                        ? (calculateDaysLeft(
                            item.loanDate,
                            item.returnDate!,
                            item.status
                          ) as number) <= 3
                          ? "text-red-500"
                          : "text-emerald-500"
                        : "text-library-dark"
                    )}
                  >
                    {(() => {
                      const result = calculateDaysLeft(
                        item.loanDate,
                        item.returnDate!,
                        item.status
                      );
                      return typeof result === "number"
                        ? `${result} days left`
                        : result;
                    })()}{" "}
                  </span>
                </TableCell>
                <TableCell className="text-center font-bold text-library-dark">
                  ${parseFloat(item.bookCopy.bookTitle.book_price).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Link
                    href={`/books/book/${item.bookCopy.bookTitle.id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-golden-amber hover:bg-golden-amber/10 rounded-lg transition-colors"
                  >
                    Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!loading && userFilteredLoans.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
              <Clock className="w-12 h-12 text-golden-amber/50" />
              <p className="text-library-dark/80">
                {searchTerm
                  ? "No matching loans found"
                  : "No active book loans"}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-8 text-center min-h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-golden-amber"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;
