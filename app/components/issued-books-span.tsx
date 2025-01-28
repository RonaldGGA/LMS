"use client";

import { Separator } from "@/components/ui/separator";
import { BookStatus, IssuedBook } from "@prisma/client";
import { format, differenceInHours, differenceInMinutes } from "date-fns";
import { Clock2, Info, X } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

interface IssuedBooksSpanProps {
  user_id: string | undefined;
  userIssuedBooks: IssuedBook[];
}

const IssuedBooksSpan: React.FC<IssuedBooksSpanProps> = ({
  user_id,
  userIssuedBooks,
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
    const closestReturnDate = userIssuedBooks.reduce<IssuedBook | null>(
      (closest, book) => {
        const returnDate = new Date(book.return_date);

        if (returnDate >= currentTime) {
          if (!closest || returnDate < new Date(closest.return_date)) {
            return book;
          }
        }
        return closest;
      },
      null
    );

    setReturnDate(
      closestReturnDate ? new Date(closestReturnDate.return_date) : null
    );
  }, [userIssuedBooks, currentTime]);

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

  if (!userIssuedBooks) {
    return null;
  }

  if (
    hide ||
    userIssuedBooks.filter((item) => item.status === BookStatus.ISSUED)
      .length === 0
  ) {
    return null;
  }

  return (
    <div className=" fixed bottom-10 right-2 p-4 space-y-2 border border-gray-300 backdrop-blur-sm bg-gray-900 text-gray-200 shadow-lg rounded-md">
      <X
        onClick={() => setHide(true)}
        width={15}
        height={15}
        className="absolute top-3 right-3 hover:text-white cursor-pointer scale-105"
      />

      <Link
        href={`/issued?id=${user_id}`}
        className="text-sm flex gap-1 items-center justify-center text-gray-200 hover:text-blue-500 cursor-pointer transition-colors"
      >
        <Info width={18} className="text-blue-500" />
        <span>More</span>
      </Link>
      <Separator />
      <div className="text-gray-100">
        Issued Books:
        <span className="ml-1 font-semibold">
          {
            userIssuedBooks.filter((item) => item.status === BookStatus.ISSUED)
              .length
          }
        </span>
      </div>
      {timeLeft && (
        <span className="flex text-sm justify-center items-center gap-1">
          <Clock2 width={17} />
          <span>{timeLeft || "..."}</span>
        </span>
      )}
    </div>
  );
};

export default IssuedBooksSpan;
