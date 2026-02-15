"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

interface addRatingProps {
  userId: string;
  userRating: number;
  bookId: string;
}

export const addRating = async (values: addRatingProps) => {
  const { userId, userRating, bookId } = values;
  const result = await db.$transaction(
    async (tx) => {
      try {
        if (!userId || !userRating || !bookId || !bookId) {
          return createErrorResponse("Invalid rating values");
        }

        const dbRating = await tx.bookRating.findFirst({
          where: {
            userId,
            bookTitleId: bookId,
          },
        });
        if (dbRating) {
          const updatedRating = await tx.bookRating.update({
            where: {
              id: dbRating.id,
            },
            data: {
              rating: userRating,
            },
          });
          if (!updatedRating) {
            return createErrorResponse(
              "Something happened updating the rating",
            );
          } else {
            return {
              success: true,
              error: null,
              data: updatedRating,
            };
          }
        }

        const rating = await tx.bookRating.create({
          data: {
            userId,
            bookTitleId: bookId,
            rating: userRating,
          },
        });

        return {
          success: true,
          error: null,
          data: rating,
        };
      } catch (error) {
        console.log(error);
        return createErrorResponse(
          "Something happened in the server in rating adding",
        );
      }
    },
    {
      timeout: 30000,
    },
  );
  return result;
};
