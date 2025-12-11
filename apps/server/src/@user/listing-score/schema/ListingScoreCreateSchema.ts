import { z } from "@hono/zod-openapi";
import { ListingScoreTypeEnumSchema } from "~/app/listing-score/schema/ListingScoreTypeEnumSchema";

export const ListingScoreCreateSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing to score",
		}),
		score: ListingScoreTypeEnumSchema,
	})
	.openapi("ListingScoreCreate", {
		description: "Data for creating a new listing score",
	});

export type ListingScoreCreateSchema = typeof ListingScoreCreateSchema;

export namespace ListingScoreCreateSchema {
	export type Type = z.infer<ListingScoreCreateSchema>;
}
