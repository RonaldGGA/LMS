"use server";

import { auth } from "@/auth";
import { getBookById } from "@/data/getBook";
import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { BookStatus } from "@prisma/client";
import { format } from "date-fns";
import { date } from "zod";
export const returnBook = async (bookId: string) => {
  try {
    //get the book from the db
    const dbBook = await getBookById(bookId);
    if (!dbBook?.success) {
      return createErrorResponse(`Invalid book with id ${bookId}`);
    }

    //check if the book is used or not
    if (dbBook?.data?.book_status !== BookStatus.ISSUED) {
      return createErrorResponse(`Book isnt issued rigtht now`);
    }

    //get the actual user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return createErrorResponse(`User not authenticated`);
    }

    //search if there is an issue book in the issue table with a return date after now
    const issuedBookData = await db.issuedBook.findFirst({
      where: {
        book: {
          id: bookId,
        },
        user: {
          id: userId,
        },
        return_date: {
          gte: new Date(), // Buscar donde la fecha de retorno es mayor o igual a la fecha actual
        },
      },
    });

    if (!issuedBookData) {
      return createErrorResponse(`Error searching the book, no book return `);
    }

    // Update the returned date of the book to now and the avaibility in the issue table
    const issueResult = await db.issuedBook.update({
      where: {
        id: issuedBookData.id,
      },
      data: {
        status: BookStatus.IN_STOCK,
        return_date: new Date(),
      },
    });
    if (!issueResult) {
      return createErrorResponse(
        `Error updating the status of the book in the issue table`
      );
    }

    // Update the book to stock status
    const result = await db.book.update({
      where: {
        id: bookId,
      },
      data: {
        book_status: BookStatus.IN_STOCK,
      },
    });
    if (!result) {
      return createErrorResponse(`Error updating the status of the book`);
    }
    return { success: true, error: null, data: issuedBookData };
  } catch (error) {
    console.log(error);
    return createErrorResponse(`Internal server error`);
  }
};
