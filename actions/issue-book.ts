"use server";

import { auth } from "@/auth";
import { getBookById } from "@/data/getBook";
import db from "@/lib/prisma";
import { format } from "date-fns";
import { createErrorResponse } from "@/lib/utils";
import { BookLoanRequestStatus, BookLoanStatus, Role } from "@prisma/client";
import { acceptLoanRequest } from "./accept-issue-request";
import { updateBookPopularity } from "./update-book-popularity";

export const issueBook = async (
  id: string,
  providedUserId?: string,
  requestId?: string,
  role?: Role
) => {
  try {
    const result = await db.$transaction(
      async (tx) => {
        // get the userId
        const session = await auth();
        let userId;

        if (!providedUserId) {
          userId = session?.user?.id;
          if (!userId) {
            throw new Error(
              "Invalid userId, not signed or admin didnt called it"
            );
          }
        } else {
          userId = providedUserId;
        }
        const userRole = session?.user?.role;
        let allowed = false;

        if (userRole === Role.LIBRARIAN || userRole == Role.SUPERADMIN) {
          allowed = true;
        }

        // get the book from the db
        const dbBook = await getBookById(id);

        if (!dbBook?.success || !dbBook.data) {
          throw new Error(`Invalid book with id ${id}`);
        }
        if (dbBook.data.stock === 0) {
          throw new Error("Book not avaible, out of stock");
        }

        // Check if the user already requested or owns one of the books
        const allBookRequestedCopies = await db.bookCopy.findFirst({
          where: {
            bookTitleId: id,
            bookLoans: {
              some: {
                userId,
                status: BookLoanStatus.ISSUED,
              },
            },
            bookLoanRequests: {
              some: {
                userId,
                status: BookLoanRequestStatus.PENDING,
              },
            },
          },
        });
        if (allBookRequestedCopies) {
          throw new Error("User already owns or requested one of the books");
        }

        // Check if there are books avaible in stock
        if (dbBook.data.stock <= 0) {
          throw new Error("Book not avaible in stock");
        }

        // ToDo:not needed for mvp time zone correct handling
        const issued_date = format(
          new Date(Date.now()),
          "yyyy-MM-dd'T'HH:mm:ss'Z'"
        ); // 'Z' indica UTC
        const return_date = format(
          new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd'T'HH:mm:ss'Z'"
        );

        const bookCopy = await tx.bookCopy.findFirst({
          where: {
            bookTitleId: id,
          },
        });
        if (!bookCopy) {
          throw new Error("Error searching an avaible copy to issue");
        }

        // Use the data from the book to coonect that book with the issued ones
        const bookLoanData = await tx.bookLoan.create({
          data: {
            bookCopyId: bookCopy.id,
            userId,
            status: BookLoanStatus.ISSUED,
            //Improve time zone handling, not needed for the mvp
            loanDate: issued_date,
            returnDate: return_date,
          },
        });

        if (!bookLoanData) {
          throw new Error("Something happened creating the new loan");
        }

        // Update all the copies of the book in the stock
        const updateStock = await tx.bookTitle.update({
          where: {
            id,
          },
          data: {
            stock: dbBook.data.stock - 1,
          },
        });
        if (!updateStock) {
          throw new Error("Error updating the book in the stock");
        }

        // If the book needs a payment, then accept it if the admin called this function allowing it
        if (
          dbBook.data &&
          parseFloat(dbBook.data?.book_price) > 0 &&
          allowed &&
          requestId
        ) {
          const acceptIssueRequestResult = await acceptLoanRequest(
            requestId,
            "Paymend correctly verified",
            role
          );
          if (!acceptIssueRequestResult.success) {
            return createErrorResponse(
              "Couldnt manage the notification request"
            );
          }
        }
        await updateBookPopularity(id);

        return { success: true, error: null, data: bookLoanData };
      },
      {
        timeout: 30000,
      }
    );

    return result;
  } catch (error) {
    console.log(error);
    return createErrorResponse(
      "Something happened server side in issue-books action"
    );
  }
};
