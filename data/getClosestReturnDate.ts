"use server";

import db from "@/lib/prisma";
import { BookLoanStatus } from "@prisma/client";

export const getClosesToReturn = async () => {
  try {
    const book = await db.bookLoan.findFirst({
      where: {
        status: BookLoanStatus.ISSUED,
      },
      select: {
        loanDate: true,
      },
      orderBy: {
        loanDate: "desc",
      },
    });
    if (!book) {
      return {
        success: false,
        error: "Something happened while fetching the closest book to return",
        data: null,
      };
    }
    return { success: true, error: null, data: book };
  } catch (err) {
    if (err) {
      console.log(err);
      return { success: false, error: "Internal server error", data: null };
    }
  }
};
