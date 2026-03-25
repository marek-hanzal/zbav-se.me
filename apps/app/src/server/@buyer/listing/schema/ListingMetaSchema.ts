import { z } from "@hono/zod-openapi";
import { LatLonSchema } from "~/common/schema/LatLonSchema";

export const ListingMetaSchema = z
	.looseObject({
		latLon: LatLonSchema.optional(),
		feedId: z.string().min(1, "Feed ID is required").optional().openapi("FeedId", {
			description: "Reference feed to do counts e.g. like is in favourites",
		}),
	})
	.strip()
	.openapi("ListingMeta", {
		description: "Meta data for listing collection",
	});

export type ListingMetaSchema = typeof ListingMetaSchema;

export namespace ListingMetaSchema {
	export type Type = z.infer<ListingMetaSchema>;
}
