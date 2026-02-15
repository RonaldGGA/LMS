"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export const getBorrowedBooksByUser = async (id: string) => {
  try {
    const response = await db.bookLoan.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        status: true,
        loanDate: true,
        returnDate: true,
        bookCopy: {
          select: {
            bookTitle: {
              select: {
                id: true,
                book_price: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        returnDate: "asc",
      },
    });
    if (!response) {
      return createErrorResponse(
        "Error fetching the books borrowed by the user",
      );
    }
    return { success: true, error: null, data: response };
  } catch (err) {
    if (err) {
      console.log(err);
      return createErrorResponse(
        "Internal server error finding the books borrowed by the user",
      );
    }
  }
};
