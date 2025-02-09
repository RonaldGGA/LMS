"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { CategoryPlus } from "@/types";
import { connect } from "http2";

interface addRatingProps {
  userId: string;
  userRating: number;
  bookId: string;
}

export const addRating = async (values: addRatingProps) => {
  const { userId, userRating, bookId } = values;
  try {
    // validate inputs
    if (!userId || !userRating || !bookId) {
      return createErrorResponse("Invalid rating values");
    }

    // TODO: really validate the inputs

    //check if the user already rated it
    const dbRating = await db.rating.findFirst({
      where: {
        userId,
        bookId,
      },
    });
    if (dbRating) {
      const updatedRating = await db.rating.updateMany({
        where: {
          userId,
          bookId,
        },
        data: {
          rating: userRating,
        },
      });
      if (!updatedRating) {
        return createErrorResponse("Something happened updating the rating");
      } else {
        return {
          success: true,
          error: null,
          data: updatedRating,
        };
      }
    }

    // add the rating if its a new rating
    const rating = await db.rating.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        Book: {
          connect: {
            id: bookId,
          },
        },
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
      "Something happened in the server in rating adding"
    );
  }
};
