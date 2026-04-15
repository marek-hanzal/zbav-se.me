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
