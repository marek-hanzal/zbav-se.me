import { tool } from "@openai/agents";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedCollection",
]);

export const toolFeedCollection = tool({
	name: "feed-collection",
	needsApproval: false,
	description: "User-bound saved listing searches. Use small cursors and requested fields only.",
	parameters: FeedQuerySchema,
	async execute(data) {
		logger.trace("toolFeedCollection", {
			data,
		});

		const items = await feedCollectionFn({
			data: {
				...data,
				limit: 4,
			},
		});

		return {
			count: items.length,
			items,
		};
	},
});
