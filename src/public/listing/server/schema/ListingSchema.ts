import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.pick({
			id: true,
			createdAt: true,
			withImageUrl: true,
		}).shape,
		withRestriction: RestrictionEnumSchema.meta({
			description: `
Effective restriction of this listing.
            `.trim(),
		}),
		// 		location: LocationSchema,
		// 		category: CategorySchema,
	})
	.strip()
	.meta({
		id: "PublicListing",
		description: "Public listing data",
	});

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<ListingSchema>;
}
