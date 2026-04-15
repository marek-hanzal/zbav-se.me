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
- Always add 'filter.withIgnored: false'
- Add 'filter.withOwn: false' if user not states otherwise; tell user you're filtering out his own listings
- To get favourite listings, use 'filter.isFavourite: true'

How to:
"Give me listings in my feed"
- Resolve feed, get it's feed.query object
- Use that feed.query object as direct input into this tool

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
