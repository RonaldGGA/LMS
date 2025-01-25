"use server";
import db from "@/lib/prisma";

export const getUserById = async (id: string | undefined) => {
  console.log(`Fetching user with ID: ${id}`);
  try {
    const user = await db.user.findFirst({
      where: {
        id,
      },
      include: {
        issuedBooks: true,
      },
    });
    // console.log({ USER: user });
    return user;
  } catch (error) {
    if (error) {
      console.log(error);
      return null;
    }
  }
};
export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        username,
      },
      include: {
        issuedBooks: true,
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
