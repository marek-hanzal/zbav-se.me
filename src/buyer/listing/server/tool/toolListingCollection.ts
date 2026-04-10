import { tool } from "@openai/agents";
import { listingCollectionFn } from "~/buyer/listing/fn/listingCollectionFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";

export const toolListingCollection = tool({
	name: "listing-collection",
	needsApproval: false,
	description: `
        Access collection of listings like you're browsing the listing catalog.

        Here you can sort, filter out different listings.

        This is the main entry point for buyer to find out what he wants.

        Carefully read input query as it will guide you, what you can use.
    `.trim(),
	parameters: ListingToolQuerySchema,
	// outputSchema: z.array(ListingSchema),
	async execute(data) {
		return listingCollectionFn({
			data,
		});
	},
});
