"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export const getLiveBooksName = async (partial_name: string) => {
  if (!partial_name) {
    return createErrorResponse("No name specified");
  }

  try {
    const books = await db.bookTitle.findMany({
      where: {
        title: {
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
        title: true,
      },
      distinct: ["title", "authorId"],
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
export const getDefaultBooks = async (quantity: number) => {
  if (!quantity) {
    return createErrorResponse("no specified quantity");
  }

  try {
    const books = await db.bookTitle.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        img: true,
        book_price: true,
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

export const getBooksByName = async (
  title: string | undefined,
  quantity: number | undefined
) => {
  try {
    if (!title && title !== undefined) {
      return createErrorResponse("Invalid book name");
    }

    const books = await db.bookTitle.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        img: true,
        book_price: true,
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
      },
      take: quantity,
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
      return createErrorResponse("Internal server error finding books by name");
    }
  }
};
