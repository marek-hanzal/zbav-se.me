import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { CategorySchema } from "~/user/category/server/schema/CategorySchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.shape,
		location: LocationSchema,
		category: CategorySchema,
		restrictions: z.array(RestrictionEnumSchema).meta({
			description: `
Computed restrictions from category and listing. Read-only.
            `.trim(),
		}),
	})
	.omit({
		userId: true,
		titleVec: true,
		withCategoryDiscovery: true,
		withCategoryRestriction: true,
		withLocationGeo: true,
		withTitleSearch: true,
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
