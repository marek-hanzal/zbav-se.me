import { z } from "zod";

export const ListingCartCreateSchema = z
	.object({
		feedId: z.string().openapi({
			description: "Feed this listing belongs to",
		}),
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
	})
	.openapi({
		description: "Listing cart create schema",
	});

export type ListingCartCreateSchema = typeof ListingCartCreateSchema;

export namespace ListingCartCreateSchema {
	export type Type = z.infer<ListingCartCreateSchema>;
}
