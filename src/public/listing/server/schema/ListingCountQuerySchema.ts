import { z } from "zod";
import { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";

export const ListingCountQuerySchema = z
	.looseObject({
		...ListingQuerySchema.pick({
			where: true,
			meta: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "PublicListingCountQuery",
		description: "Query object for public listing count",
	});

export type ListingCountQuerySchema = typeof ListingCountQuerySchema;

export namespace ListingCountQuerySchema {
	export type Type = z.infer<ListingCountQuerySchema>;
}
