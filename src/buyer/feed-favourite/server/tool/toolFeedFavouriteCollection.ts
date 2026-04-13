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
	description: "User-bound favourite feeds. Use small cursors and requested fields only.",
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
