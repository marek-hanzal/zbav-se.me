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
- 'type: user': User-facing feed. When the user asks about "my feeds" in general, filter type to usepss type from agent workflows.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(FeedToolCreateSchema),
	async execute(data) {
		logger.trace("toolFeedCreate", {
			data,
		});

		return feedCreateFn({
			data,
		});
	},
});
