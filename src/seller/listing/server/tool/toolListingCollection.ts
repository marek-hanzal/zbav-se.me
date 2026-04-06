import { tool } from "ai";
import { z } from "zod";
import { listingCollectionFn } from "~/seller/listing/server/fn/listingCollectionFn";
import { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";

export const toolListingCollection = tool({
	title: "listing-collection",
	type: "function",
	needsApproval: false,
	description: `
        Access collection of listings (user-private) from the seller's point of view.

        Useful for managing listings.
    `.trim(),
	inputSchema: ListingToolQuerySchema,
	outputSchema: z.array(ListingSchema),
	async execute(data) {
		return listingCollectionFn({
			data,
		});
	},
});
