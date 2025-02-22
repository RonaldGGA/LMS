"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { BookLoanRequestStatus, Role } from "@prisma/client";
export const acceptLoanRequest = async (
  requestId: string,
  reason?: string,
  role?: Role
) => {
  try {
    const loanRequestResult = await db.bookLoanRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: BookLoanRequestStatus.ACCEPTED,
        description: reason,
      },
      select: {
        userId: true,
        bookCopy: {
          select: {
            bookTitle: {
              select: {
                title: true,
                author: {
                  select: {
                    author_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!loanRequestResult) {
      return createErrorResponse("Error happened updating the loan request");
    }
    if (role === Role.SUPERADMIN || role === Role.LIBRARIAN) {
      return { success: true, error: null, data: loanRequestResult };
    }

    const notification = await db.notification.create({
      data: {
        userId: loanRequestResult.userId,
        message: `Accepted your request of borrowing the book ${loanRequestResult.bookCopy.bookTitle.title} by ${loanRequestResult.bookCopy.bookTitle.author.author_name}`,
      },
    });
    if (!notification) {
      return createErrorResponse("Error creating the user notification");
    }

    return { success: true, error: null, data: loanRequestResult };
  } catch (error) {
    console.log(error);
    return createErrorResponse(`Internal server error`);
  }
};
