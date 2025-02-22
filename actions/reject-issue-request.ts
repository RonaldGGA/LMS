"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import {
  BookLoanRequestStatus,
  BookSecurityDepositState,
} from "@prisma/client";
export const rejectIssueRequest = async (
  requestId: string,
  reason?: string
) => {
  const result = await db.$transaction(
    async (tx) => {
      try {
        const updateSecurityDepositToInactive =
          await tx.bookSecurityDeposit.updateMany({
            where: {
              bookLoanRequest: {
                id: requestId,
              },
              state: BookSecurityDepositState.ACTIVE,
            },
            data: {
              state: BookSecurityDepositState.UNACTIVE,
            },
          });
        if (!updateSecurityDepositToInactive) {
          throw new Error("Error inactivating the bail");
        }
        const issueRequestDeclineResult = await tx.bookLoanRequest.update({
          where: {
            id: requestId,
          },
          data: {
            status: BookLoanRequestStatus.DECLINED,
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

        if (!issueRequestDeclineResult) {
          throw new Error(
            "Error declining the request of the user of borrowing the book"
          );
        }

        const notification = await tx.notification.create({
          data: {
            userId: issueRequestDeclineResult.userId,
            message: `DECLINED your request of borrowing the book ${issueRequestDeclineResult.bookCopy.bookTitle.title} by ${issueRequestDeclineResult.bookCopy.bookTitle.author.author_name}`,
          },
        });
        if (!notification) {
          return createErrorResponse("Error creating the user notification");
        }

        return { success: true, error: null, data: issueRequestDeclineResult };
      } catch (error) {
        console.log(error);
        return createErrorResponse(`Internal server error`);
      }
    },
    {
      timeout: 30000,
    }
  );
  return result;
};
