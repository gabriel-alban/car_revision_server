import {z} from 'zod';

const strongPasswordSchema = z
  .string()
  .min(10, "Password must be at least 12 characters")
  .max(128, "Password is too long")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character")
  .refine((value) => !/\s/.test(value), "Password must not contain spaces");

export const registerSchema = z.object({
  body: z.object({
    username: z.string().trim().min(3).max(50),
    email: z.string().trim().toLowerCase().email().max(255),
    password: strongPasswordSchema
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email()
      .max(255, "Email is too long"),
    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Password is too long")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});