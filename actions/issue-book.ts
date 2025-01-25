"use server";

import { auth } from "@/auth";
import { getBookById } from "@/data/getBook";
import db from "@/lib/prisma";
import { BookStatus } from "@prisma/client";
import { format } from "date-fns";
import { date } from "zod";
export const issueBook = async (id: string) => {
  try {
    //get the book from the db
    const dbBook = await getBookById(id);
    if (!dbBook?.success) {
      return {
        success: false,
        error: `Invalid book with id ${id}`,
        data: null,
      };
    }
    //check if the book is used or not
    if (dbBook?.data?.book_status === BookStatus.ISSUED) {
      return {
        success: false,
        error: `Book already issued by someone alse ...`,
        data: null,
      };
    }

    //get the actual user
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return {
        success: false,
        error: `User not authenticated`,
        data: null,
      };
    }
    // To Do
    const issued_date = format(
      new Date(Date.now()),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    ); // 'Z' indica UTC
    const return_date = format(
      new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd'T'HH:mm:ss'Z'"
    );
    //use the data from the book to coonect that book with the issued ones
    const issuedBookData = await db.issuedBook.create({
      data: {
        book: {
          connect: {
            id: id, // ID del libro que estás emitiendo
          },
        },
        user: {
          connect: {
            id: userId, // ID del usuario que está emitiendo el libro
          },
        },
        //Improve this to get the actual hour, independently from the users date at that moment
        issued_date,
        return_date,
      },
    });
    //return the data with the success
    if (!issuedBookData) {
      return { success: false, error: "Error issuing the book", data: null };
    }
    // Update the book to issued status
    const result = await db.book.update({
      where: {
        id: id,
      },
      data: {
        book_status: BookStatus.ISSUED,
      },
    });
    if (!result) {
      return {
        success: false,
        error: "Error updating the status of the book",
        data: null,
      };
    }
    return { success: true, error: null, data: issuedBookData };
  } catch (error) {
    if (error) {
      console.log(error);
      return { success: false, error: "Internal server error", data: null };
    }
  }
};
