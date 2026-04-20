import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { feedCountFn } from "~/buyer/feed/fn/feedCountFn";
import { FeedToolQuerySchema } from "~/buyer/feed/server/schema/FeedToolQuerySchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolFeedCollection",
]);

export const toolFeedCollection = tool({
	name: "feed-collection",
	needsApproval: false,
	description: `
Current user's saved feeds.

Modes:
- collection: return a small page of matching feeds
- count: return how many matching feeds exist

Use only user-facing feeds (type: user), not internal search feeds (type: search).
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(
		z
			.looseObject({
				type: z.enum([
					"count",
					"collection",
				]),
				query: FeedToolQuerySchema,
			})
			.strip(),
	),
	async execute({ type, query }) {
		logger.trace("toolFeedCollection", {
			type,
			query,
		});

		return match(type)
			.with("count", async () => {
				const count = await feedCountFn({
					data: query,
				});
				const hasMore = await feedCountFn({
					data: {},
				});

				return {
					count: count,
					hasMore: hasMore > 0,
				} as const;
			})
			.with("collection", async () => {
				const items = await feedCollectionFn({
					data: {
						...query,
						limit: 4,
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
