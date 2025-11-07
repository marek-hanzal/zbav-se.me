import { z } from "@hono/zod-openapi";
import { ListingScoreTypeSchema } from "./ListingScoreTypeSchema";

export const ListingScoreDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the score",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	userId: z.string().openapi({
		description: "ID of the user who created the score",
	}),
	type: ListingScoreTypeSchema.openapi({
		description: "Type of score",
	}),
	score: z.number().int().openapi({
		description: "Score value",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ListingScoreDbSchema = typeof ListingScoreDbSchema;

export namespace ListingScoreDbSchema {
	export type Type = z.infer<ListingScoreDbSchema>;
}
