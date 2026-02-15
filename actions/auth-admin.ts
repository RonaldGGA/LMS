"use server";

import db from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

interface registerAdminProps {
  username: string;
  password: string;
  dni?: string;
  role?: Role;
}

export const registerAdmin = async (values: registerAdminProps) => {
  const result = db.$transaction(async (tx) => {
    const { username, password, dni } = values;
    if (!username || !password || !dni || dni.length != 11) {
      return { success: false, error: "Missing or invalid values" };
    }
    const prevUser = await tx.userAccount.findFirst({
      where: {
        OR: [{ username }, { dni }],
      },
    });
    if (prevUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return { success: false, error: "An error ocurred with your password" };
    }

    try {
      const newUser = tx.userAccount.create({
        data: {
          username,
          password: hashedPassword,
          dni,
          role: Role.SUPERADMIN,
        },
      });
      return { success: true, error: null, user: newUser };
    } catch (error) {
      if (error) {
        console.log({ REGISTER: error });
        return { success: false, error: "Internal Server error" };
      }
    }
  });
  return result;
};

interface loginUserProps {
  username: string;
  password: string;
}

export const loginUser = async (values: loginUserProps) => {
  let user = null;

  try {
    const { username, password } = values;
    if (!username || !password) {
      return user;
    }
    const dbUser = await db.userAccount.findFirst({
      where: {
        username,
      },
    });
    if (!dbUser) {
      return user;
    }
    const validatePassword = await bcrypt.compare(password, dbUser.password);
    if (!validatePassword) {
      return user;
    }
    user = {
      id: dbUser.id,
      username: dbUser.username,
      password: dbUser.password,
    };
    return user;
  } catch (err) {
    if (err) {
      console.log({ LOGIN: err });
      return user;
    }
  }
};
