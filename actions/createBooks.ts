"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
interface createBookProps {
  book_name: string;
  author: string;
  categories: string[];
  price: string;
  img: string;
}

export const createBook = async (
  values: createBookProps,
  categories: { id: string; name: string }[]
) => {
  const result = await db.$transaction(
    async (tx) => {
      try {
        // get the values
        const { book_name, author, img = "", price = "0" } = values;
        console.log(`Your image src is ${img}`);
        if (!book_name) {
          return createErrorResponse("Invalid book name");
        }

        // Handle author creation
        let author_id = "";
        const authorDb = await tx.bookAuthor.findFirst({
          where: {
            author_name: author,
          },
        });

        // Handle repeated books, no books with the same author and name
        const isDbBook = await tx.bookTitle.findFirst({
          where: {
            title: book_name,
            authorId: authorDb?.id,
          },
        });
        if (isDbBook) {
          return createErrorResponse("Book already exists");
        }

        try {
          if (!authorDb) {
            const authorName = author && author.length > 2 ? author : "unknown";

            const author_res = await tx.bookAuthor.create({
              data: {
                author_name: authorName,
              },
            });
            author_id = author_res.id;
          } else {
            author_id = authorDb.id;
          }
        } catch (error) {
          console.log({ CREATEBOOKS: error });
          return createErrorResponse("Database error with author handling");
        }

        //TODO: validate img Url

        // Create the new book wiithot categories

        const newBook = await tx.bookTitle.create({
          data: {
            title: book_name,
            authorId: author_id,
            book_price: parseInt(price) > 0 ? price : "0",
            description: "",
            img,
            bookRatings: {},
            stock: 1,
            categories: {
              connectOrCreate: categories.map((category) => ({
                where: {
                  id: category.id,
                },
                create: {
                  name: category.name,
                },
              })),
            },
            bookCopies: {
              create: {
                copy_number: 1,
              },
            },
          },
        });

        // Connect the categories

        return { success: true, error: "", data: newBook };
      } catch (error) {
        if (error) {
          console.log(error);
          return createErrorResponse(
            "Something happened creating the new book"
          );
        }
      }
    },
    { timeout: 30000 }
  );
  return result;
};
