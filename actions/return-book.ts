"use server";

import { auth } from "@/auth";
import { getBookById } from "@/data/getBook";
import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import {
  BookLoanRequestStatus,
  BookLoanStatus,
  BookSecurityDepositState,
} from "@prisma/client";

export const returnBook = async (bookId: string) => {
  const result = await db.$transaction(
    async (tx) => {
      try {
        //get the book from the db
        const dbBook = await getBookById(bookId);
        if (!dbBook?.success || !dbBook.data) {
          throw new Error(`Invalid book with id ${bookId}`);
        }

        //get the actual user
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) {
          return createErrorResponse("User not authenticated");
        }

        const book = await tx.bookTitle.findUnique({
          where: {
            id: bookId,
          },
          select: {
            book_price: true,

            bookCopies: {
              select: {
                id: true,
                bookLoans: {
                  select: { status: true, userId: true, id: true },
                },
              },
            },
          },
        });
        if (!book || !book.bookCopies || book.bookCopies.length === 0) {
          return createErrorResponse(
            `Book with the id ${bookId} has no copies available`
          );
        }
        const activeLoan = book.bookCopies
          .flatMap((copy) => copy.bookLoans)
          .filter(
            (loan) =>
              loan.status === BookLoanStatus.ISSUED && loan.userId === userId
          );
        if (activeLoan.length > 1) {
          return createErrorResponse(
            "There are 2 copies or more borrowed by the same user "
          );
        }
        if (activeLoan.length === 0) {
          return createErrorResponse("There is not copy borrowed at all");
        }

        if (parseFloat(book.book_price) > 0) {
          const BookLoanRequest = await db.bookLoanRequest.findFirst({
            where: {
              bookCopy: {
                bookTitleId: bookId,
              },
              status: BookLoanRequestStatus.ACCEPTED,
              userId,
              bookSecurityDeposit: {
                state: BookSecurityDepositState.ACTIVE,
              },
            },
            include: {
              bookSecurityDeposit: {
                select: {
                  amount: true,
                },
              },
            },
            orderBy: {
              acceptanceDate: "asc",
            },
          });

          if (!BookLoanRequest) {
            return createErrorResponse(
              `No se encontró una solicitud de préstamo aceptada para el usuario ${userId} y la copia del libro con el id:${bookId}`
            );
          }
          const securityDepositRefund = await tx.bookSecurityDeposit.update({
            where: {
              id: BookLoanRequest.bookSecurityDepositId,
            },
            data: {
              returnDate: new Date(Date.now()),
              refundDate: new Date(Date.now()),
              refundedAmount: BookLoanRequest.bookSecurityDeposit.amount,
              state: BookSecurityDepositState.UNACTIVE,
            },
          });
          if (!securityDepositRefund) {
            return createErrorResponse("Error updating the security code");
          }
        }

        // Update the returned date of the book to now and the avaibility in the issue table
        const updateLoanResult = await tx.bookLoan.update({
          where: {
            id: activeLoan[0].id,
          },
          data: {
            status: BookLoanStatus.IN_STOCK,
            returnDate: new Date(Date.now()),
          },
        });
        if (!updateLoanResult) {
          return createErrorResponse(
            `Error updating the status of the book in the loan table`
          );
        }
        // Update the book stock status
        const updateStockResult = await tx.bookTitle.update({
          where: {
            id: bookId,
          },
          data: {
            stock: dbBook && dbBook.data.stock + 1,
          },
        });
        if (!updateStockResult) {
          return createErrorResponse("Error updating the stock of the book");
        }

        // We should handle the amount as the user inputs it, maybe next year xd

        return { success: true, error: null, data: updateStockResult };
      } catch (error) {
        console.log(error);
        return createErrorResponse(`Internal server error`);
      }
    },
    {
      timeout: 30000,
    }
  );
  return result;
};
