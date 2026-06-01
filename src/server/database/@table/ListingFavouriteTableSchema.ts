import { z } from "zod";

export const ListingFavouriteTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the favourite item",
		}),
		userId: z.string().meta({
			description: "ID of the user who added the item to favourites",
		}),
		feedId: z.string().meta({
			description: "Feed this listing belongs to",
		}),
		listingId: z.string().meta({
			description: "ID of the listing",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "ListingFavouriteTable",
		description: "Database row for a listing favourite.",
	})
	.strip();

export type ListingFavouriteTableSchema = typeof ListingFavouriteTableSchema;

export namespace ListingFavouriteTableSchema {
	export type Type = z.infer<ListingFavouriteTableSchema>;
}
