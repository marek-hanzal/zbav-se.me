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
        Access collection of buyer listings like you're browsing the catalog.

        Use this to filter, sort, and inspect listings that are visible to a buyer.
        The collection is already bound to the user, so you can call it with an empty {}
        input when no extra filters are needed.
    `.trim(),
	parameters: ListingToolQuerySchema,
	async execute(data) {
		logger.trace("toolListingCollection", {
			data,
		});

		const items = await listingCollectionFn({
			data,
		});

		return {
			count: items.length,
			items,
		};
	},
});
