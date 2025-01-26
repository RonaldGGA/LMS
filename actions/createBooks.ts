"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

interface createBookProps {
  book_name: string;
  author: string;
  category: string;
  price: string;
}

export const createBook = async (values: createBookProps) => {
  try {
    // get the values
    const { book_name, author, category = "", price = "0" } = values;
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
    // check if the category exists
    const categoryDb = await db.category.findFirst({
      where: {
        cat_type: category,
      },
    });
    //if it doesnt exist, create one and get its id, if it does exists, get its id
    let cat_id = "";
    if (!categoryDb) {
      if (category.length > 2) {
        const cat_res = await db.category.create({
          data: {
            cat_type: category,
          },
        });
        if (cat_res) {
          cat_id = cat_res.id;
        } else {
          return { success: false, error: "Invalid category" };
        }
      } else {
        return { success: false, error: "Category must be larger" };
      }
    } else {
      cat_id = categoryDb.id;
    }
    // check if the author exists
    const authorDb = await db.author.findFirst({
      where: {
        author_name: author,
      },
    });

    //if it does exist, get the id, if not, create a new author and get its id
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
    const newBook = await db.book.create({
      data: {
        book_name,
        cat_id: cat_id.length > 5 ? cat_id : "",
        author_id: author_id.length > 5 ? author_id : "",
        book_price: parseInt(price) > 0 ? price : "0",
        description: "",
        img: "",
        rating: "",
      },
    });
    if (!newBook) {
      return { success: false, error: "Couldnt add the book" };
    }
    return { success: true, error: "", data: newBook };
  } catch (error) {
    if (error) {
      console.log(error);
      return { success: false, error: "Internal server error" };
    }
  }
};
