import { tool } from "@openai/agents";
import { feedFavouriteCountFn } from "~/buyer/feed-favourite/fn/feedFavouriteCountFn";
import { FeedFavouriteCountQuerySchema } from "~/buyer/feed-favourite/server/schema/FeedFavouriteCountQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedFavouriteCount",
]);

export const toolFeedFavouriteCount = tool({
	name: "feed-favourite-count",
	needsApproval: false,
	description: `
        Count current user's favourite saved listing searches matching the query.

        Feed type values:
        - user: User-facing feed. When the user asks about "my feeds" in general, filter type to user.
        - search: Internal/agent-derived saved search type. Do not use this type from agent workflows.
    `.trim(),
	parameters: FeedFavouriteCountQuerySchema,
	async execute(data) {
		logger.trace("toolFeedFavouriteCount", {
			data,
		});

		const count = await feedFavouriteCountFn({
			data,
		});

		const hasMore = await feedFavouriteCountFn({
			data: {},
		});

		return {
			count: count,
			hasMore: hasMore > 0,
		} as const;
	},
});
