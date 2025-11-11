import { z } from "@hono/zod-openapi";
import { ListingFilterSchema } from "../../listing/schema/ListingFilterSchema";
import { ListingMetaSchema } from "../../listing/schema/ListingMetaSchema";
import { ListingSortSchema } from "../../listing/schema/ListingSortSchema";

export const FeedPatchSchema = z
	.object({
		id: z.string().min(1),
		name: z.string().min(1).optional().openapi({
			description: "Name of the feed",
		}),
		locationId: z.string().nullish().openapi({
			description: "ID of the location associated with the feed",
		}),
		filter: ListingFilterSchema.optional(),
		sort: ListingSortSchema.array().optional(),
		meta: ListingMetaSchema.optional(),
	})
	.openapi("FeedPatch", {
		description: "Data for updating an existing feed",
	});

export type FeedPatchSchema = typeof FeedPatchSchema;

export namespace FeedPatchSchema {
	export type Type = z.infer<FeedPatchSchema>;
}
