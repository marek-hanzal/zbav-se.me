import { z } from "zod";
import { LatLonSchema } from "@/lib/common/location";

export const ListingMetaSchema = z
	.looseObject({
		latLon: LatLonSchema.optional(),
	})
	.strip()
	.meta({
		id: "PublicListingMeta",
		description: "Meta data for public listing collection",
	});

export type ListingMetaSchema = typeof ListingMetaSchema;

export namespace ListingMetaSchema {
	export type Type = z.infer<ListingMetaSchema>;
}
