import { tool } from "@openai/agents";
import { feedCountFn } from "~/buyer/feed/fn/feedCountFn";
import { FeedToolCountQuerySchema } from "~/buyer/feed/server/schema/FeedToolCountQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedCount",
]);

export const toolFeedCount = tool({
	name: "feed-count",
	needsApproval: false,
	description: `
Count current user's saved listing searches matching the query.

Hint:
- 'type: user': User-facing feed. When the user asks about "my feeds" in general, filter type to user (always use this filter).
- 'type: search': Internal/agent-derived saved search type. Do not use this type from agent workflows.

Boundary:
- If the user asks for "feed" and "listing/ad" in a simple prompt, you may need to combine feed + listing tools to get an answer
    `.trim(),
	parameters: FeedToolCountQuerySchema,
	async execute(data) {
		logger.trace("toolFeedCount", {
			data,
		});

		const count = await feedCountFn({
			data,
		});
		const hasMore = await feedCountFn({
			data: {},
		});

		return {
			count: count,
			hasMore: hasMore > 0,
		} as const;
	},
});
