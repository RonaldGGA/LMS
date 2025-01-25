"use server";

import db from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";
import bcrypt from "bcryptjs";

//register a new user

//get all the inputs
interface registerUserProps {
  username: string;
  password: string;
  DNI?: string;
}

//TODO validar si la fecha del DNI es valida
export const registerUser = async (values: registerUserProps) => {
  const { username, password, DNI } = values;

  if (!username || !password || !DNI || DNI.length != 11) {
    return { success: false, error: "Missing or invalid values" };
  }
  const prevUser = await db.user.findFirst({
    where: {
      OR: [{ username }, { DNI }],
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
    const newUser = db.user.create({
      data: {
        username,
        password: hashedPassword,
        DNI,
      },
    });
    return { success: true, error: null, user: newUser };
  } catch (error) {
    if (error) {
      console.log({ REGISTER: error });
      return { success: false, error: "Internal Server error" };
    }
  }
};

//login a new user
interface loginUserProps {
  username: string;
  password: string;
}

export const loginUser = async (values: loginUserProps) => {
  let user = null;
  try {
    // get the inputs and validate
    // console.log(values);
    const { username, password } = values;
    if (!username || !password) {
      return user;
    }
    // get the user in the db and validate
    const dbUser = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (!dbUser) {
      return user;
    }
    // validate the password correctness
    const validatePassword = await bcrypt.compare(password, dbUser.password);
    if (!validatePassword) {
      return user;
    }
    // return the user with username and password
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
