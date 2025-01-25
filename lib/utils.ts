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
