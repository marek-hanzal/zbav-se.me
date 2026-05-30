import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { CategorySchema } from "~/public/category/server/schema/CategorySchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.pick({
			id: true,
			categoryId: true,
			priceType: true,
			price: true,
			currency: true,
			title: true,
			description: true,
			condition: true,
			age: true,
			warranty: true,
			delivery: true,
			pros: true,
			cons: true,
			createdAt: true,
			visibleAt: true,
			expiresAt: true,
			withImageUrl: true,
		}).shape,
		withRestriction: RestrictionEnumSchema.meta({
			description: `
Effective restriction of this listing.
            `.trim(),
		}),
		isActive: z.boolean().meta({
			description: "Whether the listing is currently live and not yet expired",
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
