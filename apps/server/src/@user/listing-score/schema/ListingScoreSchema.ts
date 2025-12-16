import { z } from "@hono/zod-openapi";
import { ListingScoreDbSchema } from "~/app/listing-score/schema/ListingScoreDbSchema";

export const ListingScoreSchema = z
	.object({
		...ListingScoreDbSchema.shape,
	})
	.omit({
		userId: true,
	})
	.openapi("ListingScore", {
		description: "Listing score data",
	});

export type ListingScoreSchema = typeof ListingScoreSchema;

export namespace ListingScoreSchema {
	export type Type = z.infer<ListingScoreSchema>;
}
