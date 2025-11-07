import { z } from "@hono/zod-openapi";

export const ListingScoreTypeSchema = z
	.enum([
		"listing",
		"ignore",
		"view",
		"cart",
	])
	.openapi({
		description: "Type of score to assign",
	});

export type ListingScoreTypeSchema = typeof ListingScoreTypeSchema;

export namespace ListingScoreTypeSchema {
	export type Type = z.infer<ListingScoreTypeSchema>;
}
