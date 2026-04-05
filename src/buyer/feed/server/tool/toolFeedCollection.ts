import { tool } from "ai";
import { feedCollectionFn } from "~/buyer/feed/server/fn/feedCollectionFn";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";
import { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";

export const toolFeedCollection = tool({
	title: "feed-collection",
	type: "function",
	needsApproval: false,
	description: "Get a list of feeds (saved searches for listings)",
	inputSchema: FeedQuerySchema,
	outputSchema: FeedSchema.array(),
	async execute(data) {
		return feedCollectionFn({
			data,
		});
	},
});
