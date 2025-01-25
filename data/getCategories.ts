"use server";

import db from "@/lib/prisma";

export const getCategories = async () => {
  try {
    const categories = await db.category.findMany();

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
