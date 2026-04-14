import { tool } from "@openai/agents";
import { listingCollectionFn } from "~/seller/listing/fn/listingCollectionFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCollection",
]);

export const toolListingCollection = tool({
	name: "seller-listing-collection",
	needsApproval: false,
	description: `
        Current seller user's published listings matching the query. Use for seller-owned listing management and lookup.

        The tool caps results to a small page. For buyer-visible marketplace search, use buyer-listing-collection instead.

        Sort fields:
        - price: Listing price.
        - condition: Item condition score.
        - age: Item age score.
        - createdAt: When the listing was created.
        - updatedAt: When the listing was last changed.
        - expiresAt: When the listing expires.
    `.trim(),
	parameters: ListingToolQuerySchema,
	async execute(data) {
		logger.trace("toolListingCollection", {
			data,
		});

		const items = await listingCollectionFn({
			data: {
				...data,
				limit: 8,
			},
		});

		return {
			count: items.length,
			items,
		};
	},
});
