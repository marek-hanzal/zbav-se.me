import { tool } from "ai";
import { feedCreateFn } from "~/buyer/feed/server/fn/feedCreateFn";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";

export const toolFeedCreate = tool({
	title: "feed-create",
	type: "function",
	needsApproval: false,
	description: "Create a new feed (saved search for listings)",
	inputSchema: FeedCreateSchema,
	outputSchema: FeedSchema,
	async execute(data) {
		return feedCreateFn({
			data,
		});
	},
});
