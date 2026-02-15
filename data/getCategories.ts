"use server";

import db from "@/lib/prisma";

export const getCategories = async (name: string) => {
  try {
    const categories = await db.bookCategory.findMany({
      where: {
        name: {
          startsWith: name,
          mode: "insensitive",
        },
      },
      take: 10,
    });
    return {
      success: true,
      error: null,
      data: categories,
    };
  } catch (err) {
    if (err) {
      console.error(err);
      return {
        success: false,
        error: "An unexpected error occurred",
        data: null,
      };
    }
  }
};
