import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { listingCollectionFn } from "~/seller/listing/fn/listingCollectionFn";
import { listingCountFn } from "~/seller/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolListingCollection",
]);

export const toolListingCollection = tool({
	name: "seller-listing-collection",
	needsApproval: false,
	description: `
Current seller user's published listings matching the query.

Modes:
- collection: return a small page of matching listings
- count: return how many matching listings exist

Use for seller-owned listing lookup and management.
Do not use for buyer-visible marketplace search.
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
				};
			})
			.exhaustive();
	},
});
