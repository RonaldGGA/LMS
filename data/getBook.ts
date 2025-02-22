"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export const getBookById = async (id: string) => {
  try {
    const book = await db.bookTitle.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        book_price: true,
        authorId: true,
        title: true,
        img: true,
        description: true,
        stock: true,

        bookRatings: {
          select: {
            rating: true,
          },
        },
        author: {
          select: {
            author_name: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
        bookCopies: {
          select: {
            bookLoanRequests: {
              select: {
                userId: true,
                status: true,
              },
            },
          },
        },
      },
    });
    console.log(book);
    if (!book) {
      return createErrorResponse("Couldnt find the book");
    }
    return { success: true, error: null, data: book };
  } catch (err) {
    console.log(err);
    return createErrorResponse("Internal Server Error in book by Id searching");
  }
};
