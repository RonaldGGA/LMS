"use server";

import db from "@/lib/prisma";

export const getBookById = async (id: string) => {
  try {
    const book = await db.book.findUnique({
      where: {
        id: id,
      },
      include: {
        ratings: {
          select: {
            rating: true,
          },
        },
        issuedBooks: {
          select: {
            return_date: true,
            user_id: true,
          },
          orderBy: {
            return_date: "desc",
          },
        },
        author: {
          select: {
            author_name: true,
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
    console.log(book);
    if (!book) {
      return {
        success: false,
        error: "Something happened while fetching the book",
        data: null,
      };
    }
    return { success: true, error: null, data: book };
  } catch (err) {
    if (err) {
      console.log(err);
      return { success: false, error: "Internal server error", data: null };
    }
  }
};
