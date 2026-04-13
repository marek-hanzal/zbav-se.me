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
	description: "Count user-bound saved listing searches.",
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
