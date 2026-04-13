import { tool } from "@openai/agents";
import { feedCreateFn } from "~/buyer/feed/fn/feedCreateFn";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedCreate",
]);

export const toolFeedCreate = tool({
	name: "feed-create",
	needsApproval: false,
	description: "Create a user-bound saved listing search from known query fields.",
	parameters: FeedCreateSchema,
	// outputSchema: FeedSchema,
	async execute(data) {
		logger.trace("toolFeedCreate", {
			data,
		});

		return feedCreateFn({
			data,
		});
	},
});
