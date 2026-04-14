import { tool } from "@openai/agents";
import { feedCountFn } from "~/buyer/feed/fn/feedCountFn";
import { FeedCountQuerySchema } from "~/buyer/feed/server/schema/FeedCountQuerySchema";
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

        Feed type values:
        - user: User-facing feed. When the user asks about "my feeds" in general, filter type to user.
        - search: Internal/agent-derived saved search type. Do not use this type from agent workflows.
    `.trim(),
	parameters: FeedCountQuerySchema,
	async execute(data) {
		logger.trace("toolFeedCount", {
			data,
		});

		return feedCountFn({
			data,
		});
	},
});
