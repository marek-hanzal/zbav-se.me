import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { listingCollectionFn } from "~/buyer/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/buyer/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolListingCollection",
]);

export const toolListingCollection = tool({
	name: "buyer-listing-collection",
	needsApproval: false,
	description: `
Buyer-visible listings matching the query.

Modes:
- collection: return a small page of matching listings
- count: return how many matching listings exist

Use for buyer-side browsing and search.
Do not use for seller-owned listing management.

Prefer query filters such as category, location, price, favourite, ignored, feed, or transaction when relevant.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(
		z
			.looseObject({
				type: z.enum([
					"count",
					"collection",
				]),
				query: ListingToolQuerySchema,
			})
			.strip(),
	),
	async execute({ type, query }) {
		logger.trace("toolListingCollection", {
			type,
			query,
		});

		return match(type)
			.with("count", async () => {
				const count = await listingCountFn({
					data: query,
				});

				const hasMore = await listingCountFn({
					data: {},
				});

				return {
					count: count,
					hasMore: hasMore > 0,
				} as const;
			})
			.with("collection", async () => {
				const items = await listingCollectionFn({
					data: {
						...query,
						limit: 8,
					},
				});

				return {
					count: items.length,
					items,
				} as const;
			})
			.exhaustive();
	},
});
