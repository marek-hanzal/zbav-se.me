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
	description: `
Current user's saved listing searches. Use small cursors and compact filters only.

Hint:
- 'type: user': User-facing feed. When the user asks about "my feeds" in general, filter type to user (always use this filter).
- 'type: search': Internal/agent-derived saved search type. Do not use this type from agent workflows.
    `.trim(),
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
