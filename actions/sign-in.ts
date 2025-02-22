"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/zod-schemas";
import { AuthError } from "next-auth";

type SignInData = {
  username: string;
  password: string;
};

export async function authenticate(
  prevState: string | undefined,
  formData: SignInData
) {
  try {
    // This is a backend check of the credentials, it is checkec before in the frontend
    const response = loginSchema.safeParse(formData);
    if (!response.success && response.error) {
      throw new Error(response.error.message);
    }
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}
