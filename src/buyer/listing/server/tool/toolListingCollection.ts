import { tool } from "@openai/agents";
import { listingCollectionFn } from "~/buyer/listing/fn/listingCollectionFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCollection",
]);

export const toolListingCollection = tool({
	name: "listing-collection",
	needsApproval: false,
	description: `
        Buyer-visible listing collection. Prefer category/location filters and small cursors.
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
