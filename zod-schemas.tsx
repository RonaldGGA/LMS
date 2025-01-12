import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

export const registerSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  DNI: z.string().min(11, {
    message: "11 characters min",
  }),
});

export const bookSchema = z.object({
  book_name: z.string().min(2, {
    message: "Invalid book name, min 2 characters",
  }),
  author: z.string(),
  category: z.string().refine((val) => (!val ? val : val.length > 2), {
    message: "Minimun category length is 2",
  }),
  price: z
    .string()
    .trim()
    .refine(
      (val) => {
        const parsedValue = parseInt(val);
        return parsedValue >= 0 || parsedValue < 999;
      },
      {
        message: "Minimum price is 0 and maximum price is 999",
      }
    ),
  img: z.string(),
  description: z.string(),
  // pin: z.string().min(4, {
  //   message: "Please, enter 4 numbers",
  // }),
});

export const searchSchema = z.object({
  book_name: z.string().min(1, "Book name is required"),
});
