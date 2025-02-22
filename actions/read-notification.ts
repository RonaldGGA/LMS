"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
export const readNotification = async (notificationId: string) => {
  try {
    const loanRequestResult = await db.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
      select: {
        id: true,
      },
    });

    if (!loanRequestResult) {
      return createErrorResponse("Error happened updating the loan request");
    }
    return { success: true, error: null, data: loanRequestResult };
  } catch (error) {
    console.log(error);
    return createErrorResponse(`Internal server error`);
  }
};
