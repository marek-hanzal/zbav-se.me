import { tool } from "@openai/agents";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { FeedToolQuerySchema } from "~/buyer/feed/server/schema/FeedToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedCollection",
]);

export const toolFeedCollection = tool({
	name: "feed-collection",
	needsApproval: false,
	description: `
Get the current user's saved feeds. Use only user-facing feeds (type: user), not internal search feeds (type: search).
    `.trim(),
	parameters: FeedToolQuerySchema,
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
