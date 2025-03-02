import { Role } from "@prisma/client";
import { z } from "zod";

// Single fields schema

export const dniSchema = z
  .string()
  .length(11, {
    message: "DNI must contain exactly 11 characters",
  })
  .regex(/^\d{11}$/, {
    message: "DNI must have only numbers",
  })
  .refine(
    (dni) => {
      const year = parseInt(dni.substring(0, 2));
      const month = parseInt(dni.substring(2, 4));
      const day = parseInt(dni.substring(4, 6));

      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;

      // Validación avanzada de días por mes
      const daysInMonth = new Date(2000 + year, month, 0).getDate();
      return day <= daysInMonth;
    },
    {
      message: "First 6 digits do not make a valid date (YYMMDD)",
    }
  )
  .refine(
    (dni) => {
      // Validate these digits with country-specific logics
      const sequence = dni.substring(6, 9);
      const checkDigit = dni.substring(9, 11);

      return /^\d+$/.test(sequence) && /^\d+$/.test(checkDigit);
    },
    {
      message: "Post-sequency invalid",
    }
  );

export const usernameSchema = z
  .string()
  .min(3, {
    message: "Username must be at least 3 characters",
  })
  .max(20, {
    message: "Username cannot exceed 20 characters",
  })
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers and underscores"
  )
  .regex(/^(?![0-9_]).*$/, "Username cannot start with a number or underscore");

export const priceSchema = z
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
  );
export const passwordSchema = z
  .string()
  .superRefine((val, ctx) => {
    // Permitir strings vacíos que serán transformados a undefined
    if (val === "") return true;

    if (val.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 8,
        type: "string",
        inclusive: true,
        message: "Password must be at least 8 characters",
      });
    }

    if (val.length > 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 30,
        type: "string",
        inclusive: true,
        message: "Password cannot exceed 30 characters",
      });
    }

    if (!/(?=.*[a-z])/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least 1 lowercase letter",
      });
    }

    if (!/(?=.*[A-Z])/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least 1 uppercase letter",
      });
    }

    if (!/(?=.*\d)/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least 1 number",
      });
    }

    if (!/(?=.*[!@#$%^&*()\-_=+{};:,<.>])/.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must contain at least 1 special character",
      });
    }
  })
  .transform((val) => (val === "" ? undefined : val));

// formSchemas

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  dni: dniSchema,
  role: z.custom<Role>().optional(),
});

export const adminUpdateProfileSchema = z.object({
  username: usernameSchema,
  profileImg: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .nullable(),

  dni: dniSchema,
  password: passwordSchema.optional(),
  confirmPassword: passwordSchema.optional(),
  role: z.custom<Role>().optional(),
});

export const updateProfileSchema = z
  .object({
    username: usernameSchema,
    profileImg: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val))
      .nullable(),
    DNI: dniSchema,
    oldPassword: z
      .union([passwordSchema, z.literal("")])
      .optional()
      .transform((val) => val || undefined),
    newPassword: z
      .union([passwordSchema, z.literal("")])
      .optional()
      .transform((val) => val || undefined),
  })
  .superRefine((data, ctx) => {
    // Validar solo si newPassword tiene valor

    if (data.newPassword && !data.oldPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Current password is required to change the password",
        path: ["oldPassword"],
      });
    }

    // Validar solo si oldPassword tiene valor
    if (data.oldPassword && !data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Old password is only required if you need to set a new password",
        path: ["oldPassword"],
      });
    }
  });

export const bookSchema = z.object({
  book_name: z.string().min(2, {
    message: "Invalid book name, min 2 characters",
  }),
  author: z.string(),
  categories: z.array(z.string()),
  price: priceSchema,
  img: z.string(),
  description: z.string(),
});

export const searchSchema = z.object({
  title: z.string(),
});

export const ratingSchema = z.object({
  rating: z.number().refine((item) => {
    return item >= 0 && item <= 5;
  }),
});
