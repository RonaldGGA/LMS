"use server";

import { auth } from "@/auth";
import db from "@/lib/prisma";

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
        category: {
          select: {
            cat_type: true,
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
