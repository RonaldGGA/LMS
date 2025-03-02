"use server";
import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";

export const getUserById = async (id: string) => {
  if (!id) {
    console.log(`No id ${id}`);
    return null;
  }
  try {
    const user = await db.userAccount.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        role: true,
        img: true,
        password: true,
        bookLoans: {
          select: {
            returnDate: true,
            status: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    if (error) {
      console.log(error);
      return null;
    }
  }
};

export const getUserForProfile = async (id: string) => {
  if (!id) {
    console.log(`No id ${id}`);
    return null;
  }
  try {
    const user = await db.userAccount.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        dni: true,
        img: true,
        password: true,
        createdAt: true,
      },
    });
    if (!user) {
      return createErrorResponse("No user found for profile");
    }

    return { success: true, error: null, data: user };
  } catch (error) {
    console.log(error);
    return createErrorResponse(
      "Internal server error in searching user for profile"
    );
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.userAccount.findFirst({
      where: {
        username,
      },
      include: {
        bookLoanRequests: true,
      },
    });
    return user;
  } catch (error) {
    if (error) {
      console.log(error);
      return null;
    }
  }
};

export const getBigUser = async (id: string) => {
  try {
    const user = await db.userAccount.findFirst({
      where: {
        id,
      },

      select: {
        role: true,
        bookLoans: {
          select: {
            status: true,
            userId: true,
            bookCopy: {
              select: {
                bookTitleId: true,
              },
            },
          },
        },
        bookLoanRequests: {
          select: {
            status: true,
            userId: true,
            requestDate: true,
            bookCopy: {
              select: {
                bookTitleId: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      return createErrorResponse("Failed to search the user");
    }
    return { success: true, error: null, data: user };
  } catch (error) {
    if (error) {
      console.log(error);
      return createErrorResponse("Internal server error searching the user");
    }
  }
};
