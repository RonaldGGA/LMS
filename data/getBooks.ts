"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export const getLiveBooksName = async (partial_name: string) => {
  if (!partial_name) {
    return createErrorResponse("No name specified");
  }

  try {
    const books = await db.book.findMany({
      where: {
        book_name: {
          contains: partial_name,
          mode: "insensitive",
        },
      },
      take: 10,
      select: {
        author: {
          select: {
            author_name: true,
          },
        },
        id: true,
        book_name: true,
      },
    });

    return {
      success: true,
      error: null,
      data: books,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return createErrorResponse("Server side error");
  }
};

export const getBooksByName = async (book_name: string) => {
  try {
    // check book name
    console.log({ THIS: book_name });
    if (!book_name) {
      return { success: false, error: "Invalid book name", data: null };
    }
    // get all the books in the library that includes that name
    const books = await db.book.findMany({
      where: {
        book_name: {
          contains: book_name,
          mode: "insensitive",
        },
      },
      include: {
        author: {
          select: {
            author_name: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
        categories: {
          select: {
            category: {
              select: {
                cat_type: true,
              },
            },
          },
        },
      },
    });

    // return those books id and name
    return {
      success: true,
      error: null,
      data: books,
    };
  } catch (err) {
    if (err) {
      console.error(err);
      return {
        success: false,
        error: "An unexpected error occurred",
        data: null,
      };
    }
  }
};
