import { tool } from "@openai/agents";
import { feedPatchFn } from "~/buyer/feed/fn/feedPatchFn";
import { FeedPatchSchema } from "~/buyer/feed/server/schema/FeedPatchSchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedPatch",
]);

export const toolFeedPatch = tool({
	name: "feed-patch",
	needsApproval: false,
	description: "Patch one existing feed selected by a narrow query.",
	parameters: FeedPatchSchema,
	async execute(data) {
		logger.trace("toolFeedPatch", {
			data,
		});

		return feedPatchFn({
			data,
		});
	},
});
