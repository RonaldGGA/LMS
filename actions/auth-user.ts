"use server";

import db from "@/lib/prisma";
import { createErrorResponse, hashPassword } from "@/lib/utils";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

//register a new user

//get all the inputs
interface registerUserProps {
  username: string;
  password: string;
  dni?: string;
  role?: Role;
}

export const registerUser = async (values: registerUserProps) => {
  const result = await db.$transaction(
    async (tx) => {
      const { username, password, dni, role = Role.MEMBER } = values;

      // Validate input fields
      if (!username || !password || !dni) {
        return createErrorResponse("Missing required fields");
      }

      // Validate DNI format
      if (dni.length !== 11 || isNaN(Number(dni))) {
        return { success: false, error: "Invalid DNI number" };
      }

      // Extract date parts from DNI
      const datePart = dni.substring(0, 8); // Assuming date is in the first 8 digits

      // Handle both DDMMYYYY and DDMMYY formats
      let day, month, year;
      if (datePart.length === 8) {
        day = parseInt(datePart.substring(0, 2), 10);
        month = parseInt(datePart.substring(2, 4), 10) - 1; // Months are 0-based in JavaScript
        year = parseInt(datePart.substring(4, 8), 10);
      } else if (datePart.length === 6) {
        day = parseInt(datePart.substring(0, 2), 10);
        month = parseInt(datePart.substring(2, 4), 10) - 1; // Months are 0-based in JavaScript
        year = 2000 + parseInt(datePart.substring(4, 6), 10); // Assume years 00-99 as 2000-2099
      } else {
        return { success: false, error: "Invalid date format in DNI" };
      }

      // Validate date parts
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return createErrorResponse("Invalid date in DNI");
      }

      if (day < 1 || day > 31 || month < 0 || month > 11) {
        return createErrorResponse("Invalid date in DNI");
      }

      const date = new Date(year, month, day);
      if (isNaN(date.getTime())) {
        return createErrorResponse("Invalid date in DNI");
      }

      const hashedPassword = await hashPassword(password);
      if (!hashedPassword) {
        return createErrorResponse("Failted to hash the password");
      }

      try {
        // Create new user
        const newUser = await tx.userAccount.create({
          data: {
            username,
            password: hashedPassword,
            dni,
            role: role || Role.MEMBER,
          },
        });

        if (!newUser) {
          return createErrorResponse("Failed to create the user");
        }

        console.log("User created successfully");
        return { success: true, error: null, user: newUser };
      } catch (error) {
        console.error("Error during user registration:", error);
        if (error instanceof Error) {
          // TODO: handle each error separatly
          if (
            error.message.includes("duplicate") ||
            error.message.includes("Unique constraint")
          ) {
            return createErrorResponse("User already exists");
          }

          return createErrorResponse(error.message);
        } else {
          return createErrorResponse("An unknown server error occurred");
        }
      }
    },
    {
      timeout: 30000,
    }
  );

  return result;
};

//login a new user
interface loginUserProps {
  username: string;
  password: string;
}
export const loginUser = async (values: loginUserProps) => {
  try {
    const { username, password } = values;

    // Input validation
    if (!username || !password) {
      return createErrorResponse("Username and password are required.");
    }

    // Find user in database
    const dbUser = await db.userAccount.findFirst({
      where: {
        username,
      },
    });

    if (!dbUser) {
      return createErrorResponse(
        "Username not found. Please check your username."
      );
    }

    // Validate password
    const validatePassword = await bcrypt.compare(password, dbUser.password);

    if (!validatePassword) {
      return createErrorResponse("The password you entered is incorrect.");
    }

    // Construct user data without password
    const user = {
      id: dbUser.id,
      username: dbUser.username,
      role: Role.MEMBER,
    };

    return { success: true, error: null, data: user };
  } catch (err) {
    console.error("Login Error:", err);
    return createErrorResponse(
      "A server error occurred during login. Please try again."
    );
  }
};
