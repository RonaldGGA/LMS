"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

interface createBookProps {
  book_name: string;
  author: string;
  categories: string[];
  price: string;
}

export const createBook = async (values: createBookProps) => {
  try {
    // get the values
    const { book_name, author, categories, price = "0" } = values;
    if (!book_name) {
      return { success: false, error: "Invalid book name" };
    }
    // no repeated books
    // TODO: MAYBE add a validation, perhaps there are 2 books with the same name, but not with the same author so validate that
    const isDbBook = await db.book.findFirst({
      where: {
        book_name,
      },
    });

    //validate the existance of the categories
    const searchCategory = async (categoryId: string) => {
      const categoryDb = await db.category.findFirst({
        where: {
          id: categoryId,
        },
      });
      if (!categoryDb) {
        return createErrorResponse("Invalid category id");
      }
    };
    // check if the category exists
    categories.forEach((categoryId) => {
      searchCategory(categoryId);
    });

    const authorDb = await db.author.findFirst({
      where: {
        author_name: author,
      },
    });

    // validate the existance of the author

    // TODO: improve this
    let author_id = "";

    try {
      if (!authorDb) {
        const authorName = author && author.length > 2 ? author : "unknown";

        const author_res = await db.author.create({
          data: {
            author_name: authorName,
          },
        });

        if (author_res) {
          author_id = author_res.id;
        } else {
          return { success: false, error: "Invalid Author" };
        }
      } else {
        author_id = authorDb.id;
      }
    } catch (error) {
      console.log({ CREATEBOOKS: error });
      return { success: false, error: "Database error: " };
    }

    if (isDbBook) {
      console.log("Book in db");
      return createErrorResponse("Book already in db");
    }

    // Create the new book
    // 1. Crear el libro sin categorías
    const newBook = await db.book.create({
      data: {
        book_name,
        author_id: author_id.length > 5 ? author_id : "",
        book_price: parseInt(price) > 0 ? price : "0",
        description: "",
        img: "",
        rating: "",
      },
    });

    // 2. Conectar las categorías (finalizado)
    await db.catgeoryBook.createMany({
      data: categories.map((categoryId) => ({
        bookId: newBook.id, // ID del libro creado
        categoryId: categoryId, // ID de la categoría
      })),
    });
    if (!newBook) {
      return { success: false, error: "Couldnt add the book" };
    }
    return { success: true, error: "", data: newBook };
  } catch (error) {
    if (error) {
      console.log(error);
      return createErrorResponse("Something happened creating the new book");
    }
  }
};
