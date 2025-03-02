"use client";

import { Separator } from "@/components/ui/separator";
import { BookLoanStatus } from "@prisma/client";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { AlertCircle, Clock, Info, X } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

type userBorrowedBooks = {
  returnDate: Date | null;
  status: BookLoanStatus;
};

interface IssuedBooksSpanProps {
  user_id: string | undefined;
  userBorrowedBooks: userBorrowedBooks[];
}

const IssuedBooksSpan: React.FC<IssuedBooksSpanProps> = ({
  user_id,
  userBorrowedBooks,
}) => {
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [hide, setHide] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const calculateTimeLeft = (returnDate: Date | null, now: Date) => {
    if (!returnDate) return null;

    const timeDifference = returnDate.getTime() - now.getTime();
    const hoursDiff = Math.abs(differenceInHours(returnDate, now));
    const minutesDiff = Math.abs(differenceInMinutes(returnDate, now) % 60);

    if (timeDifference > 0) {
      return timeDifference < 86400000
        ? `${hoursDiff}h ${minutesDiff}m`
        : format(returnDate, "yyyy-MM-dd");
    } else {
      return `${hoursDiff}h ${minutesDiff}m ago`;
    }
  };

  const getReturnDate = useCallback(() => {
    // FIX EL PIE QUE LE METI CON ! AL FINAL A RETURN DATE
    const closestReturnDate =
      userBorrowedBooks.reduce<userBorrowedBooks | null>((closest, book) => {
        const returnDate = new Date(book.returnDate!);

        if (returnDate >= currentTime) {
          if (!closest || returnDate < new Date(closest.returnDate!)) {
            return book;
          }
        }
        return closest;
      }, null);

    setReturnDate(
      closestReturnDate ? new Date(closestReturnDate.returnDate!) : null
    );
  }, [userBorrowedBooks, currentTime]);

  useEffect(() => {
    getReturnDate();
  }, [getReturnDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (returnDate) {
      const calculatedTimeLeft = calculateTimeLeft(returnDate, currentTime);
      setTimeLeft(calculatedTimeLeft);
    }
  }, [returnDate, currentTime]);

  if (!userBorrowedBooks) {
    return null;
  }

  if (
    hide ||
    userBorrowedBooks.filter((item) => item.status === BookLoanStatus.ISSUED)
      .length === 0
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-lg p-4 border border-gray-200 w-64">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Active Loans
        </h3>
        <X
          onClick={() => setHide(true)}
          className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        />
      </div>

      <Separator className="my-3" />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Issued:</span>
          <span className="font-medium text-gray-900">
            {
              userBorrowedBooks.filter(
                (item) => item.status === BookLoanStatus.ISSUED
              ).length
            }
          </span>
        </div>

        {timeLeft && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Due in
            </span>
            <span className="font-medium text-blue-600">
              {timeLeft || "..."}
            </span>
          </div>
        )}
      </div>

      <Link
        href={`/issued?id=${user_id}`}
        className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
      >
        <Info className="w-4 h-4" />
        View Details
      </Link>
    </div>
  );
};

export default IssuedBooksSpan;
