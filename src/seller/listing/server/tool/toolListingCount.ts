import { tool } from "@openai/agents";
import { listingCountFn } from "~/seller/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCount",
]);

export const toolListingCount = tool({
	name: "seller-listing-count",
	needsApproval: false,
	description: `
Count current seller user's published listings matching the provided query.

Sort:
- price: Listing price.
- condition: Item condition score.
- age: Item age score.
- createdAt: When the listing was created.
- updatedAt: When the listing was last changed.
- expiresAt: When the listing expires.
    `.trim(),
	parameters: ListingToolQuerySchema,
	// outputSchema: CountSchema,
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
