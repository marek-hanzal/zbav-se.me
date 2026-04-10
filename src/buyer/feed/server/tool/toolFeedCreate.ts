import { tool } from "@openai/agents";
import { feedCreateFn } from "~/buyer/feed/fn/feedCreateFn";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";

export const toolFeedCreate = tool({
	name: "feed-create",
	needsApproval: false,
	description: `Create a new feed (saved search for listings)`.trim(),
	parameters: FeedCreateSchema,
	// outputSchema: FeedSchema,
	async execute(data) {
		return feedCreateFn({
			data,
		});
	},
});
