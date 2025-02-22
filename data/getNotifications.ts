"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { BookLoanRequestStatus } from "@prisma/client";

export const getPendingLoanRequests = async () => {
  try {
    const notifications = await db.bookLoanRequest.findMany({
      where: {
        status: BookLoanRequestStatus.PENDING,
      },
      select: {
        userId: true,
        requestDate: true,
        description: true,
        id: true,
        status: true,
        bookCopy: {
          select: {
            bookTitle: {
              select: {
                id: true,
                title: true,
                book_price: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      error: null,
      data: notifications,
    };
  } catch (error) {
    console.error("Error fetching pending notifications", error);
    return createErrorResponse("Server side error in notifications");
  }
};

export const getAllNotifications = async () => {
  try {
    const notifications = await db.notification.findMany();

    return {
      success: true,
      error: null,
      data: notifications,
    };
  } catch (error) {
    console.error("Error fetching all notifications", error);
    return createErrorResponse("Server side error in notifications");
  }
};
export const getUserPendingNotifications = async (userId: string) => {
  try {
    const notifications = await db.notification.findMany({
      where: {
        userId,
        read: false,
      },
      select: {
        message: true,
        createdAt: true,
        id: true,
      },
    });

    return {
      success: true,
      error: null,
      data: notifications,
    };
  } catch (error) {
    console.error("Error fetching user pending notifications", error);
    return createErrorResponse("Server side error in notifications");
  }
};

export const getUserNotificationsCount = async (userId: string) => {
  try {
    const notificationsCount = await db.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return {
      success: true,
      error: null,
      data: notificationsCount,
    };
  } catch (error) {
    console.error("Error fetching user count of notifications", error);
    return createErrorResponse(
      "Server side error in notifications notificationsCount user"
    );
  }
};

export const getAdminNotificationsCount = async () => {
  try {
    const notificationsCount = await db.bookLoanRequest.count({
      where: {
        status: "PENDING",
      },
    });

    return {
      success: true,
      error: null,
      data: notificationsCount,
    };
  } catch (error) {
    console.error("Error fetching user count of notifications admin", error);
    return createErrorResponse("Server side error in notifications");
  }
};
