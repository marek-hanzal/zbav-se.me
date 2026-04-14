import { tool } from "@openai/agents";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { feedFavouriteCollectionFn } from "~/buyer/feed-favourite/fn/feedFavouriteCollectionFn";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedFavouriteCollection",
]);

export const toolFeedFavouriteCollection = tool({
	name: "feed-favourite-collection",
	needsApproval: false,
	description: `
        Current user's favourite saved listing searches. Use small cursors and compact filters only.

        Feed type values:
        - user: User-facing feed. When the user asks about "my feeds" in general, filter type to user.
        - search: Internal/agent-derived saved search type. Do not use this type from agent workflows.

        Sort fields:
        - createdAt: When the feed was created.
        - updatedAt: When the feed was last changed.
    `.trim(),
	parameters: FeedQuerySchema,
	async execute(data) {
		logger.trace("toolFeedFavouriteCollection", {
			data,
		});

		return feedFavouriteCollectionFn({
			data: {
				...data,
				limit: 32,
			},
		});
	},
});
