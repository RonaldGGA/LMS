"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export const addBookCopy = async (bookId: string) => {
  const result = db.$transaction(async (tx) => {
    try {
      // 1. the other copies
      const bookCopy = await db.bookCopy.findFirstOrThrow({
        where: {
          bookTitleId: bookId,
        },
        orderBy: {
          copy_number: "desc",
        },
      });

      const newCopy = await tx.bookCopy.create({
        data: {
          ...bookCopy,
          id: undefined,
          copy_number: bookCopy.copy_number + 1,
        },
      });

      if (!newCopy) {
        throw new Error("Failed to create a new copy");
      }

      const bookTitle = await tx.bookTitle.findUnique({
        where: {
          id: bookId,
        },
        select: {
          stock: true,
        },
      });
      if (!bookTitle) {
        throw new Error("Book not found");
      }

      const updateBookStock = await tx.bookTitle.update({
        where: {
          id: bookId,
        },
        data: {
          stock: bookTitle?.stock + 1,
        },
      });

      if (!updateBookStock) {
        throw new Error("Error updating the book stock");
      }
      return { success: true, error: null, data: newCopy };
    } catch (error) {
      console.log(error);
      return createErrorResponse(
        `Internal server error creating the book copy`
      );
    }
  });
  return result;
};
