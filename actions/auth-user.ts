"use server";

import db from "@/lib/prisma";
import { createErrorResponse, ERROR_CODES, hashPassword } from "@/lib/utils";
import { ServiceResponse } from "@/types";
import { dniSchema, loginSchema } from "@/zod-schemas";
import { Prisma, Role, UserAccount } from "@prisma/client";
import bcrypt from "bcryptjs";

interface registerUserProps {
  username: string;
  password: string;
  dni?: string;
  role?: Role;
}

const validateDNI = (dni: string) => {
  const { success, error } = dniSchema.safeParse(dni);

  return { isValid: success, error: error?.message };
};

export const registerUser = async (
  values: registerUserProps
): Promise<ServiceResponse<UserAccount>> => {
  const { username, password, dni, role = Role.MEMBER } = values;
  try {
    // Validación de campos requeridos
    if (!username || !password || !dni) {
      return {
        success: false,
        error: {
          ...ERROR_CODES.VALIDATION,
          developerMessage:
            "Missing required fields: " +
            [
              username ? "" : "username",
              password ? "" : "password",
              dni ? "" : "dni",
            ]
              .filter(Boolean)
              .join(", "),
        },
      };
    }

    // Validación de formato DNI
    const dniValidation = validateDNI(dni);
    if (!dniValidation.isValid) {
      return {
        success: false,
        error: {
          ...ERROR_CODES.DNI_INVALID,
          developerMessage: `Invalid DNI structure: ${dniValidation.error}`,
        },
      };
    }

    const existingDNI = await db.userAccount.findFirst({
      where: { dni },
    });

    if (existingDNI) {
      return {
        success: false,
        error: ERROR_CODES.DNI_TAKEN,
      };
    }

    // Verificar usuario existente
    const existingUser = await db.userAccount.findFirst({
      where: { username },
    });
    if (existingUser) {
      return {
        success: false,
        error: ERROR_CODES.USER_EXISTS,
      };
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return {
        success: false,
        error: ERROR_CODES.PASSWORD_HASH,
      };
    }

    // Creación de usuario
    const newUser = await db.userAccount.create({
      data: { username, password: hashedPassword, dni, role },
    });

    return { success: true, data: newUser };
  } catch (error) {
    console.error("Registration Error:", error);

    //handle db errors

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: {
            ...ERROR_CODES.USER_EXISTS,
            developerMessage:
              "Database unique constrait violation: " + error.meta?.target,
          },
        };
      }
      return {
        success: false,
        error: {
          ...ERROR_CODES.DATABASE,
          developerMessage: `Database error: ${error.message}`,
        },
      };
    }

    // Error generic

    return {
      success: false,
      error: {
        ...ERROR_CODES.UNKNOWN,
        developerMessage:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
};

//login a new user
interface loginUserProps {
  username: string;
  password: string;
}
export const loginUser = async (values: loginUserProps) => {
  try {
    const { username, password } = values;
    const { success, error } = loginSchema.safeParse(values);
    // Input validation
    if (!success) {
      return createErrorResponse(error.message);
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
      role: dbUser.role,
    };

    return { success: true, error: null, data: user };
  } catch (err) {
    console.error("Login Error:", err);
    return createErrorResponse(
      "A server error occurred during login. Please try again."
    );
  }
};
