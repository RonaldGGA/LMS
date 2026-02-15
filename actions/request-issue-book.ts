"use server";

import { auth } from "@/auth";
import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { BookLoanRequestStatus, BookPaymentMethod } from "@prisma/client";

interface requestIssueBookProps {
  id: string;
  name: string;
  author: string;
  price: string;
  paymentMethod: BookPaymentMethod;
  paymentReference: string | undefined;
}

/**Creates a new bail, a new notification to the admin(issueRequest) and updates the stock quantity of books of the same copy */
export const requestIssueBook = async (values: requestIssueBookProps) => {
  const result = await db.$transaction(async (tx) => {
    try {
      const {
        id,
        name,
        author,
        price,
        paymentMethod,
        paymentReference = "",
      } = values;
      if (!name || !id || !author || !price) {
        throw new Error("invalid values");
      }

      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      const dbBook = await db.bookTitle.findUnique({
        where: {
          id,
        },
        include: {
          bookCopies: {
            include: {
              bookLoans: true,
              bookLoanRequests: true,
            },
          },
        },
      });
      if (dbBook && dbBook.stock <= 0) {
        throw new Error("Book not available, no book in stock");
      }

      const bookCopies = dbBook?.bookCopies.filter((copy) =>
        copy.bookLoans.every((item) => item.status === "IN_STOCK"),
      );

      if (!bookCopies) {
        return createErrorResponse("Book not avaible");
      }

      bookCopies?.sort((a, b) => a.copy_number - b.copy_number);

      const newSecurityDeposit = await tx.bookSecurityDeposit.create({
        data: {
          userId: session.user.id,
          bookCopyId: bookCopies[0].id,
          amount: price,
          paymentMethod,
          paymentReference,
          returnDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 20,
          ),
        },
      });
      if (!newSecurityDeposit) {
        throw new Error("Couldnt create the bail");
      }
      console.log("Security deposit created");

      const newRequestResponse = await tx.bookLoanRequest.create({
        data: {
          userId: session.user.id,
          bookCopyId: bookCopies[0].id,
          bookSecurityDepositId: newSecurityDeposit.id,
          description: `The user requested the book ${dbBook?.title} `,
          status: BookLoanRequestStatus.PENDING,
        },
      });
      console.log("request created");

      return { success: true, error: "", data: newRequestResponse };
    } catch (error) {
      if (error) {
        console.log(error);
        return createErrorResponse(
          `Something happened creating the new book ... {error}`,
        );
      }
    }
  });
  return result;
};
