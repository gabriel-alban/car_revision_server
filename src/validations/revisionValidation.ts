import { z } from 'zod';

export const createRevisionSchema = z.object({
    body: z.object({
        revision_title: z.string().trim().min(4, "Title is required"),
        revision_description: z.string().trim().min(10, "Description is required").optional(),
        current_km_number: z
            .number({
                error: "km_range must be a number"
            })
            .nonnegative("km_range must be 0 or greater"),
        next_km_number: z.number({ error: "Next revision km number" }).nonnegative("Next km number should be greater that 0").optional(),
        date: z.coerce.date().optional(),
        sendAlert: z.boolean().default(true),
        car: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid car")
    }),
    params: z.object({}).optional(),
    query: z.object({}).optional()
});

export const revisionParamSchema = z.object({
	params: z.object({
		carId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid car id"),
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid revision id"),
	}),
	body: z.object({}).optional(),
	query: z.object({}).optional()
});