import { z } from "@hono/zod-openapi";

export const ListingScoreCreateSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing to score",
		}),
		score: z.number().int().min(1).max(10).openapi({
			description: "Score value",
		}),
	})
	.openapi("ListingScoreCreate", {
		description: "Data for creating a new listing score",
	});

export type ListingScoreCreateSchema = typeof ListingScoreCreateSchema;

export namespace ListingScoreCreateSchema {
	export type Type = z.infer<ListingScoreCreateSchema>;
}
