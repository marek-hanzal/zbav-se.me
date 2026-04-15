import { tool } from "@openai/agents";
import { listingCountFn } from "~/buyer/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCount",
]);

export const toolListingCount = tool({
	name: "buyer-listing-count",
	needsApproval: false,
	description: `
Count buyer-visible listings matching the provided query.

Use the same filters as buyer-listing-collection when the user asks for totals or whether anything exists.

Hint:
- Always add 'filter.withIgnored: false'
- Add 'filter.withOwn: false' if user not states otherwise; tell user you're filtering out his own listings
- To get favourite listings, use 'filter.isFavourite: true'

Guide (user question + agent steps):
"Do I have any listings in my feed?" / "How many listings do I have in my feed?"
- Resolve feed, get it's feed.query object
- Use that feed.query object as direct input into this tool

Enum values:
- delivery: personal, post, package, other.
- warranty: warranty, no-warranty, custom.
- currency: CZK.
- sort fields: price, condition, age, createdAt, updatedAt, expiresAt, geo.
    `.trim(),
	parameters: ListingToolQuerySchema,
	async execute(data) {
		logger.trace("toolListingCount", {
			data,
		});

		const count = await listingCountFn({
			data,
		});

		const hasMore = await listingCountFn({
			data: {},
		});

		return {
			count: count,
			hasMore: hasMore > 0,
		} as const;
	},
});
