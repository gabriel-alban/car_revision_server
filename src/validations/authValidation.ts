import {z} from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string().trim().min(8, "Username is required").max(50),
        email: z.string().trim().min(10, "Email is required"),
        password: z.string().trim().min(10, "Password is required")
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional()
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().min(10, "Email is required"),
        password: z.string().trim().min(10, "Password is required")
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional()
})