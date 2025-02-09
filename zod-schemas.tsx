import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
    //add more constraints
  }),
});

export const passwordSchema = z.object({
  oldPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long",
    //add more constraints
  }),
});

export const registerSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
    //add more constraints
  }),
  DNI: z.string().min(11, {
    message: "11 characters min",
  }),
});

export const updateProfileSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
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
  categories: z.array(z.string()),
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

export const ratingSchema = z.object({
  rating: z.number().refine((item) => {
    return item >= 0 && item <= 5;
  }),
});
