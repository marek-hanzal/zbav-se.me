import { tool } from "@openai/agents";
import { listingCollectionFn } from "~/seller/listing/fn/listingCollectionFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCollection",
]);

export const toolListingCollection = tool({
	name: "listing-collection",
	needsApproval: false,
	description: `
        Here you've access to all user's published listings, it's useful for questions about
        what is published, how long given listing remain active, which ones are about to expire
        and other interesting stuff.

        This is main entry-point to listings from the seller's point of view.

        Collection is already bound to the user, so you can call it with empty {} object an
        input.
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
