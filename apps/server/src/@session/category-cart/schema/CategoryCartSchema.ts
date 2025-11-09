import { z } from "@hono/zod-openapi";
import { CategorySchema } from "../../category/schema/CategorySchema";

export const CategoryCartSchema = z
	.object({
		...CategorySchema.shape,
		listingCount: z.coerce.number().int().min(0).openapi({
			description: "Number of listings saved in this category",
			example: 3,
			type: "integer",
		}),
	})
	.openapi("CategoryCart", {
		description:
			"Category data transfer object extended with listing count for cart summaries",
	});

export type CategoryCartSchema = typeof CategoryCartSchema;

export namespace CategoryCartSchema {
	export type Type = z.infer<CategoryCartSchema>;
}
