"use server";

import db from "@/lib/prisma";
import { BookStatus } from "@prisma/client";

export const getClosestReturnDate = async () => {
  try {
    const books = await db.issuedBook.findMany({
      select: {
        return_date: true,
        status: true,
      },
      orderBy: {
        return_date: "asc",
      },
    });
    if (!books || books[0].status === BookStatus.IN_STOCK) {
      return {
        success: false,
        error:
          "Something happened while fetching the books or book already in stock",
        data: null,
      };
    }
    return { success: true, error: null, data: books[0] };
  } catch (err) {
    if (err) {
      console.log(err);
      return { success: false, error: "Internal server error", data: null };
    }
  }
};
