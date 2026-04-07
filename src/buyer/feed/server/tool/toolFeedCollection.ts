import { tool } from "@openai/agents";
import { feedCollectionFn } from "~/buyer/feed/server/fn/feedCollectionFn";
import { FeedQuerySchema } from "~/buyer/feed/server/schema/FeedQuerySchema";

export const toolFeedCollection = tool({
	name: "feed-collection",
	needsApproval: false,
	description: "Get a list of feeds (saved searches for listings)",
	parameters: FeedQuerySchema,
	// outputSchema: FeedSchema.array(),
	async execute(data) {
		return feedCollectionFn({
			data,
		});
	},
});
