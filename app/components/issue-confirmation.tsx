"use client";

import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BigBook } from "@/types";
import { BookStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ConfirmationProps {
  type?: BookStatus;
  bookInfo: BigBook;
  handleIssueBook?: () => void;
  handleReturnBook?: () => void;
}
const Confirmation: React.FC<ConfirmationProps> = ({
  type = BookStatus.IN_STOCK,
  bookInfo,
  handleIssueBook,
  handleReturnBook,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {type == BookStatus.ISSUED ? (
          <Button className="p-5 mt-4 bg-blue-500">Return book</Button>
        ) : (
          <Button
            //   Fix this disabled, doesnt work
            className={`mt-4 p-5  rounded-md text-white   text-sm `}
            disabled={bookInfo.book_status === BookStatus.ISSUED}
            // Disable button if book is already issued
          >
            {bookInfo.book_status === BookStatus.ISSUED
              ? "Already Issued"
              : "Issue Book"}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-7">
        <AlertDialogHeader className="space-y-7">
          <AlertDialogTitle className="text-xl">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type == BookStatus.ISSUED ? (
              //Improve this with the admin generated code maybe...
              <>
                Before returning this, make sure you get the money of the fine
                back, if it were a fine, check our{" "}
                <Link
                  href="/info"
                  className="text-semibold text-blue-500 underline underline-offset-4 hover:text-blue-700 transition-colors"
                >
                  Info Section
                </Link>{" "}
                for further information.
              </>
            ) : (
              <>
                By issuing the book, you accept the{" "}
                <Link
                  href={"/"}
                  className="underline hover:text-blue-800  transition-colors underline-offset-4 text-blue-500"
                >
                  terms & conditions
                </Link>{" "}
                of our library. You now have <b>20 days</b> to return the book
                to the store. If you encounter a genuine issue that prevents you
                from returning the book within this timeframe, please inform us.
                Otherwise,{" "}
                <Link
                  href={"/"}
                  className="text-blue-500 hover:text-blue-800  transition-colors underline underline-offset-4"
                >
                  late fees
                </Link>{" "}
                may be applied.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {type == BookStatus.ISSUED ? (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturnBook}>Ok</AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleIssueBook}>
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Confirmation;
