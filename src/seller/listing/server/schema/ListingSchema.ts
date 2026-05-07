import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { CategorySchema } from "~/user/category/server/schema/CategorySchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
		category: CategorySchema.nullable(),
		withRestriction: RestrictionEnumSchema.meta({
			description: `
Effective restriction applied on the listing.
            `.trim(),
		}),
	})
	.omit({
		userId: true,
		galleryId: true,
		withLocation: true,
		withTitle: true,
	})
	.strip()
	.meta({
		id: "Listing",
		description: "Listing data",
	});

export type ListingSchema = typeof ListingSchema;

export namespace ListingSchema {
	export type Type = z.infer<ListingSchema>;
}
