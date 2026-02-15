"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { bookSchema } from "@/zod-schemas";
interface createBookProps {
  title: string;
  author: string;
  categories: { id: string; name: string }[];
  price: number;
  img?: string;
  description: string;
}

export const createBook = async (values: createBookProps) => {
  const result = await db.$transaction(
    async (tx) => {
      try {
        const { data, error } = bookSchema.safeParse(values);
        if (error) {
          return createErrorResponse(error.message);
        }

        const { author, title, price, img, description, categories } = data;

        let author_id = "";
        const authorDb = await tx.bookAuthor.findFirst({
          where: {
            author_name: author,
          },
        });

        const isDbBook = await tx.bookTitle.findFirst({
          where: {
            title: title,
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

        const newBook = await tx.bookTitle.create({
          data: {
            title: title,
            authorId: author_id,
            book_price: price.toString(),
            description,
            authorName: author,
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

        return { success: true, error: "", data: newBook };
      } catch (error) {
        if (error) {
          console.log(error);
          return createErrorResponse(
            "Something happened creating the new book",
          );
        }
      }
    },
    { timeout: 30000 },
  );
  return result;
};
