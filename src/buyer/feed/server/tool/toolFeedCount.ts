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
	description: "Get the number of buyer feeds (saved searches for listings)",
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
