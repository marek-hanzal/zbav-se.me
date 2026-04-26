import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { CategorySchema } from "~/public/category/server/schema/CategorySchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.pick({
			id: true,
			title: true,
			price: true,
			priceType: true,
			currency: true,
			galleryId: true,
			withImageUrl: true,
			createdAt: true,
		}).shape,
		restrictions: z.array(RestrictionEnumSchema).meta({
			description: `
Computed restrictions from category and listing. Read-only.
            `.trim(),
		}),
		location: LocationSchema,
		category: CategorySchema,
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
