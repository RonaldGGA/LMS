"use server";

import db from "@/lib/prisma";
import { createErrorResponse } from "@/lib/utils";
import { CategoryPlus } from "@/types";

export const createCategoriesPlus = async (values: CategoryPlus[]) => {
  try {
    if (!(values.length > 0)) {
      return createErrorResponse("Invalid category quantity");
    }
    const categories = await db.bookCategory.createMany({
      data: values.map((item) => ({ id: item.id, name: item.name })),
    });
    return {
      success: true,
      error: null,
      data: categories,
    };
  } catch (error) {
    console.log(error);
    return createErrorResponse("Something happened in the server");
  }
};
