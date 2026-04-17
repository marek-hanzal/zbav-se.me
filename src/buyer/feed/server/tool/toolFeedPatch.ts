import { tool } from "@openai/agents";
import { feedPatchFn } from "~/buyer/feed/fn/feedPatchFn";
import { FeedToolPatchSchema } from "~/buyer/feed/server/schema/FeedToolPatchSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolFeedPatch",
]);

export const toolFeedPatch = tool({
	name: "feed-patch",
	needsApproval: false,
	description: `
Patch one existing saved listing search selected by a narrow query.

Hint:
- 'type: user': User-facing feed. When the user asks about "my feeds" in general, filter type to user (always use this filter).
- 'type: search': Internal/agent-derived saved search type. Do not use this type from agent workflows.
- Use exact 'query.filter.id' to select feed to patch
- If the user provides an address, fill locationId
- Resolve latLon from locationId and fill also query.meta.latLon

Boundaries:
- Do not invent new patch fields
- Patch only fields you're asked for
    `.trim(),
	parameters: FeedToolPatchSchema,
	async execute(data) {
		logger.trace("toolFeedPatch", {
			data,
		});

		return feedPatchFn({
			data,
		});
	},
});
