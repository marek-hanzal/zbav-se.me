import { tool } from "@openai/agents";
import { feedDeleteFn } from "~/buyer/feed/fn/feedDeleteFn";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedDelete",
]);

export const toolFeedDelete = tool({
	name: "feed-delete",
	needsApproval: false,
	description: "Delete one existing feed selected by a narrow query.",
	parameters: FeedQuerySchema,
	async execute(data) {
		logger.trace("toolFeedDelete", {
			data,
		});

		return feedDeleteFn({
			data,
		});
	},
});
