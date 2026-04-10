import { tool } from "@openai/agents";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedCollection",
]);

export const toolFeedCollection = tool({
	name: "feed-collection",
	needsApproval: false,
	description: "Get a list of feeds (saved searches for listings)",
	parameters: FeedQuerySchema,
	// outputSchema: FeedSchema.array(),
	async execute(data) {
		logger.trace("toolFeedCollection", {
			data,
		});

		return feedCollectionFn({
			data,
		});
	},
});
