import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hashPassword = async (password: string, salt = 10) => {
  try {
    const saltPassword = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, saltPassword);
    return hashedPassword;
  } catch (error) {
    if (error) {
      console.log({ HASH: error });
      return null;
    }
  }
};

export const createErrorResponse = (message: string) => ({
  success: false,
  error: message,
  data: null,
});

export const ERROR_CODES = {
  VALIDATION: {
    code: "validation_error",
    userMessage: "Please check your information",
  },
  DNI_TAKEN: {
    code: "dni_already_exists",
    userMessage: "This dni is already in use",
  },
  DNI_INVALID: {
    code: "invalid_dni_format",
    userMessage: "The ID number is invalid",
  },
  USER_EXISTS: {
    code: "user_already_exists",
    userMessage: "This username is already registered",
  },
  PASSWORD_HASH: {
    code: "password_hashing_error",
    userMessage: "Registration failed. Please try again",
  },
  DATABASE: {
    code: "database_error",
    userMessage: "Service unavailable. Try again later",
  },
  UNKNOWN: {
    code: "unknown_error",
    userMessage: "An unexpected error occurred",
  },
};
