"use server";

import db from "@/lib/prisma";

export const getIssuedBooks = async (id: string) => {
  //improve this
  try {
    const books = await db.issuedBook.findMany({
      where: {
        user_id: id,
      },
      include: {
        book: {
          select: {
            book_name: true,
            book_price: true,
            img: true,
            id: true,
            ratings: true,
            categories: {
              select: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        return_date: "asc",
      },
    });
    if (!books) {
      return {
        success: false,
        error: "Something happened while fetching the books",
        data: null,
      };
    }
    if (books.length === 0) {
      return {
        success: true,
        error: null,
        data: [],
      };
    }
    console.log({ DATA: books });
    return { success: true, error: null, data: books };
  } catch (err) {
    if (err) {
      console.log(err);
      return { success: false, error: "Internal server error", data: null };
    }
  }
};
