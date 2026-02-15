"use server";

import prisma from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export async function updateBookPopularity(bookTitleId: string) {
  prisma.$transaction(async (tx) => {
    try {
      const bookTitle = await tx.bookTitle.update({
        where: { id: bookTitleId },
        data: {
          loanCount: { increment: 1 },
          lastLoanedAt: new Date(),
        },
        select: {
          loanCount: true,
          bookRatings: true,
        },
      });

      const totalRatings = bookTitle.bookRatings.reduce(
        (sum, rating) => sum + rating.rating,
        0,
      );

      const averageRating =
        bookTitle.bookRatings.length > 0
          ? totalRatings / bookTitle.bookRatings.length
          : 0;

      await tx.bookTitle.update({
        where: { id: bookTitleId },
        data: {
          averageRating,
        },
      });
    } catch (error) {
      console.log(error);
      return createErrorResponse("An error ocurred in the server side");
    }
  });
}
