"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export const getLiveAuthors = async (
  authorValue: string,
  bookValue: string
) => {
  if (!authorValue) {
    return createErrorResponse("No name specified");
  }

  try {
    const books = await db.bookAuthor.findMany({
      where: {
        OR: [
          {
            author_name: {
              contains: authorValue,
              mode: "insensitive",
            },
          },
          {
            author_name: {
              startsWith: authorValue,
              mode: "insensitive",
            },
          },
        ],
        bookTitles: {
          some: {
            title: {
              contains: bookValue,
              mode: "insensitive",
            },
          },
        },
      },
      take: 5,
      select: {
        author_name: true,
      },
    });

    return {
      success: true,
      error: null,
      data: books.map((item) => item.author_name),
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return createErrorResponse("Server side error in authors");
  }
};
