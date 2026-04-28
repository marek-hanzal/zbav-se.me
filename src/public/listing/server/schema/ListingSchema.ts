import { z } from "zod";
import { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";

export const ListingSchema = z
	.looseObject({
		...ListingTableSchema.pick({
			id: true,
			createdAt: true,
		}).shape,
		// 		restrictions: z.array(RestrictionEnumSchema).meta({
		// 			description: `
		// Computed restrictions from category and listing. Read-only.
		//             `.trim(),
		// 		}),
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
