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
	description: `
Patch one existing saved listing search selected by a narrow query.

Prefer an exact feed id in query. Do not invent patch fields; patch only fields the user asked to change.

Hint:
- If the user provides an address, fill locationId

Feed type values:
- user: User-facing feed. When the user asks about "my feeds" in general, filter type to user.
- search: Internal/agent-derived saved search type. Do not use this type from agent workflows.

Listing query enum values:
- delivery: personal, post, package, other.
- warranty: warranty, no-warranty, custom.
- currency: CZK.
- listing sort fields: price, condition, age, createdAt, updatedAt, expiresAt, geo.
    `.trim(),
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
