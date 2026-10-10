import { z } from "zod";
import { ListingQuerySchema as CoolListingQuerySchema } from "~/buyer-listing/schema/ListingQuerySchema";
import { ListingWhereSchema } from "~/buyer-listing/schema/ListingWhereSchema";

export const ListingQuerySchema = z
	.looseObject({
		...CoolListingQuerySchema.pick({
			meta: true,
			sort: true,
		}).shape,
		where: ListingWhereSchema.omit({
			id: true,
			idIn: true,
			categoryIdIn: true,
			userId: true,
		}).optional(),
	})
	.strip()
	.meta({
		id: "FeedListingQuery",
		description: "A query usable directly with Listing domain (fetch, collection, ...)",
	});

export type ListingQuerySchema = typeof ListingQuerySchema;

export namespace ListingQuerySchema2 {
	export type Type = z.infer<ListingQuerySchema>;
}
