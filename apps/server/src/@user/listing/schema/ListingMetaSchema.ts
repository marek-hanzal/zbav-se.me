import { z } from "@hono/zod-openapi";
import { LatLonSchema } from "../../../schema/LatLonSchema";

export const ListingMetaSchema = z
	.object({
		latLon: LatLonSchema.optional(),
	})
	.openapi("ListingMeta", {
		description: "Meta data for listing collection",
	});

export type ListingMetaSchema = typeof ListingMetaSchema;

export namespace ListingMetaSchema {
	export type Type = z.infer<ListingMetaSchema>;
}
