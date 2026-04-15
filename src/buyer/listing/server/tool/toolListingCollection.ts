import { tool } from "@openai/agents";
import { listingCollectionFn } from "~/buyer/listing/fn/listingCollectionFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCollection",
]);

export const toolListingCollection = tool({
	name: "buyer-listing-collection",
	needsApproval: false,
	description: `
Buyer-visible listings matching the query. Use for browsing/searching listings, not for seller-owned listing management.

Prefer category, location/range, price, delivery, warranty, favourite, ignored, feed, or transaction filters
when available. The tool caps results to a small page.

Hint:
- You may use feed.query as an input to this tool, so you can response to e.g. "Do I have any listings in this feed?"
- Always add 'filter.withIgnored: false'
- To get favourite listings, use 'filter.isFavourite: true'

Enums:
- delivery: personal, post, package, other.
- warranty: warranty, no-warranty, custom.
- currency: CZK.
- sort fields: price, condition, age, createdAt, updatedAt, expiresAt, geo.
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
