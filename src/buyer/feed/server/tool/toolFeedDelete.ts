import { tool } from "@openai/agents";
import { feedDeleteFn } from "~/buyer/feed/fn/feedDeleteFn";
import { FeedToolQuerySchema } from "~/buyer/feed/server/schema/FeedToolQuerySchema";
import { getRootLogger } from "~/common/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedDelete",
]);

export const toolFeedDelete = tool({
	name: "feed-delete",
	needsApproval: false,
	description: `
Delete single saved listing search selected by a query.

Hint:
- 'type: user': User-facing feed. When the user asks about "my feeds" in general, filter type to user (always use this filter).
- 'type: search': Internal/agent-derived saved search type. Do not use this type from agent workflows.

Boundaries:
- Use only after clear intent to delete
- Use 'filter.id'
- If you don't know exact feed id, ask the user and resolve it using 'feed-collection(filter.fulltext="")'
    `.trim(),
	parameters: FeedToolQuerySchema.pick({
		filter: true,
	}),
	async execute(data) {
		logger.trace("toolFeedDelete", {
			data,
		});

		return feedDeleteFn({
			data,
		});
	},
});
