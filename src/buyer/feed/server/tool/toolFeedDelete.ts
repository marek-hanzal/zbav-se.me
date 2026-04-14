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
	description: `
Delete saved listing searches selected by a narrow query.

Use only after clear user intent to delete. Prefer an exact feed id; if using name/type filters, first confirm the target with feed-collection.

Feed type values:
- user: User-facing feed. When the user asks about "my feeds" in general, filter type to user.
- search: Internal/agent-derived saved search type. Do not use this type from agent workflows.
    `.trim(),
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
