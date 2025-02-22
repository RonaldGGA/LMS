"use client";

import React, { useState } from "react";

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
import { BookPaymentMethod } from "@prisma/client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ConfirmationProps {
  price: string;
  handleBorrowBook?: (
    paymentMethod: BookPaymentMethod,
    paymentReference?: string
  ) => void;
  handleReturnBook?: () => void;
  //Fix this shit with the BookStatus type
  type: string;
}
const Confirmation: React.FC<ConfirmationProps> = ({
  price,
  handleBorrowBook,
  handleReturnBook,
  type = "IN_STOCK",
}) => {
  const [paymentMethod, setPaymentMethod] = useState<BookPaymentMethod>(
    BookPaymentMethod.CASH
  );
  const [paymentReference, setPaymentReference] = useState("");

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {type == "ISSUED" ? (
          <Button className="p-5 mt-4 bg-blue-500">Return book</Button>
        ) : (
          <Button
            //   Fix this disabled, doesnt work
            className={`mt-4 p-5  rounded-md text-white   text-sm `}
            disabled={type == "ISSUED"}
            // Disable button if book is already issued
          >
            {type === "ISSUED" ? "Already Issued by you" : "Issue Book"}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="space-y-7">
        <AlertDialogHeader className="space-y-7">
          <AlertDialogTitle className="text-xl">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {type == "ISSUED" ? (
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
                to the store.{" "}
                {price && parseFloat(price) > 0 && (
                  <div className="mt-4  p-2">
                    <h2 className="text-black text-lg">
                      Select Payment Method
                    </h2>
                    <Select
                      defaultValue={BookPaymentMethod.CASH}
                      onValueChange={(value) =>
                        setPaymentMethod(
                          value == "TRANSFER"
                            ? BookPaymentMethod.TRANSFER
                            : BookPaymentMethod.CASH
                        )
                      }
                    >
                      <SelectTrigger>
                        {" "}
                        <SelectValue placeholder="Select a Method" />
                      </SelectTrigger>
                      <SelectContent>
                        {" "}
                        <SelectItem value={BookPaymentMethod.CASH}>
                          Cash
                        </SelectItem>
                        <SelectItem value={BookPaymentMethod.TRANSFER}>
                          Bank Transfer
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {paymentMethod === "TRANSFER" && (
                      <div>
                        <p>Enter transfer reference number:</p>
                        <Input
                          type="text"
                          id="transferReference"
                          placeholder="723jedw823wdwd8"
                          onChange={(e) => setPaymentReference(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {type == "ISSUED" ? (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturnBook}>Ok</AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                handleBorrowBook &&
                handleBorrowBook(
                  paymentMethod,
                  paymentReference && paymentReference
                )
              }
            >
              Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Confirmation;
