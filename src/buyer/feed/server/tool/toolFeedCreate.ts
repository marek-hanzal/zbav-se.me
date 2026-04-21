import { tool } from "@openai/agents";
import { feedCreateFn } from "~/buyer/feed/fn/feedCreateFn";
import { FeedToolCreateSchema } from "~/buyer/feed/server/schema/FeedToolCreateSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

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
- 'type: user': User-facing feed. Use this type in agentic workflows.
- 'type: search': Internal/agent-derived saved search type. Do not use this type from agent workflows.
- Pay attention to available fields in 'query' field, also in 'query.meta'
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(FeedToolCreateSchema),
	async execute(input) {
		logger.trace("toolFeedCreate", {
			data: input,
		});

		const data = await FeedToolCreateSchema.parseAsync(input);

		return feedCreateFn({
			data,
		});
	},
});
