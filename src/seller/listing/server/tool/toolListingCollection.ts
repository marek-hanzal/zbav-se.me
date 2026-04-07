import { tool } from "@openai/agents";
import { listingCollectionFn } from "~/seller/listing/server/fn/listingCollectionFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";

export const toolListingCollection = tool({
	name: "listing-collection",
	needsApproval: false,
	description: `
        Here you've access to all user's published listings, it's useful for questions about
        what is published, how long given listing remain active, which ones are about to expire
        and other interesting stuff.

        This is main entry-point to listings from the seller's point of view.
    `.trim(),
	parameters: ListingToolQuerySchema,
	// outputSchema: z.array(ListingSchema),
	async execute(data) {
		return listingCollectionFn({
			data,
		});
	},
});
