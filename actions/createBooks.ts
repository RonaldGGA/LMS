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

export const createBook = async (values: createBookProps) => {
  try {
    // get the values
    const { book_name, author, categories, img = "", price = "0" } = values;
    console.log(`Your image src is ${img}`);
    if (!book_name) {
      return { success: false, error: "Invalid book name" };
    }

    // Validate categories
    const categoryPromises = categories.map(async (categoryId) => {
      const category = await db.category.findFirst({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        throw new Error("Invalid category id");
      }
    });

    await Promise.all(categoryPromises);

    // Handle author creation
    let author_id = "";
    const authorDb = await db.author.findFirst({
      where: {
        author_name: author,
      },
    });

    // Handle repeated books, no books with the same author and name
    const isDbBook = await db.book.findFirst({
      where: {
        book_name,
        author_id: authorDb?.id,
      },
    });

    if (isDbBook) {
      console.log("Book in db");
      return createErrorResponse("Book already in db");
    }

    try {
      if (!authorDb) {
        const authorName = author && author.length > 2 ? author : "unknown";

        const author_res = await db.author.create({
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
      return { success: false, error: "Database error: " };
    }

    //TODO: validate img Url

    // Create the new book wiithot categories

    const newBook = await db.book.create({
      data: {
        book_name,
        author_id: author_id.length > 5 ? author_id : "",
        book_price: parseInt(price) > 0 ? price : "0",
        description: "",
        img,
        ratings: {},
      },
    });

    // Connect the categories
    await db.catgeoryBook.createMany({
      data: categories.map((categoryId) => ({
        bookId: newBook.id, // ID del libro creado
        categoryId: categoryId, // ID de la categoría
      })),
    });

    return { success: true, error: "", data: newBook };
  } catch (error) {
    if (error) {
      console.log(error);
      return createErrorResponse("Something happened creating the new book");
    }
  }
};
