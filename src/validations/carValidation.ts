import { z } from "zod";

export const createCarSchema = z.object({
	body: z.object({
		brand: z.string().trim().min(1, "Brand is required"),
		model: z.string().trim().min(1, "Model is required"),
		km_range: z
			.number({
				error: "km_range must be a number"
			})
			.nonnegative("km_range must be 0 or greater")
	}),
	params: z.object({}).optional(),
	query: z.object({}).optional()
});

export const carIdParamSchema = z.object({
	params: z.object({
		id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid car id")
	}),
	body: z.object({}).optional(),
	query: z.object({}).optional()
});

