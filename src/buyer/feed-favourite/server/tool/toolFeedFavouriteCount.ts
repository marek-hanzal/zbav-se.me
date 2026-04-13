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
	description: "Count favourite feeds for the current user scope.",
	parameters: FeedFavouriteCountQuerySchema,
	async execute(data) {
		logger.trace("toolFeedFavouriteCount", {
			data,
		});

		return feedFavouriteCountFn({
			data,
		});
	},
});
