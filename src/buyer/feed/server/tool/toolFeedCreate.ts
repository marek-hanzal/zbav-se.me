import { tool } from "@openai/agents";
import { feedCreateFn } from "~/buyer/feed/fn/feedCreateFn";
import { FeedToolCreateSchema } from "~/buyer/feed/server/schema/FeedToolCreateSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedCreate",
]);

export const toolFeedCreate = tool({
	name: "feed-create",
	needsApproval: false,
	description: `
Create a saved listing search for the current buyer from known query fields.

Use only when the user wants to save search criteria. Do not invent the feed name, location, category, price range, or other listing query details.

Hint:
- If the user provides an address, normalize it and fill locationId
- Resolve latLon from locationId and fill also query.meta.latLon
- 'type: user': User-facing feed. When the user asks about "my feeds" in general, filter type to user (always use this filter).
- 'type: search': Internal/agent-derived saved search type. Do not use this type from agent workflows.
- Pay attention to available fields in 'query' field, also in 'query.meta'
    `.trim(),
	parameters: FeedToolCreateSchema,
	async execute(data) {
		logger.trace("toolFeedCreate", {
			data,
		});

		return feedCreateFn({
			data,
		});
	},
});
