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
	description: `
        Create a saved listing search for the current buyer from known query fields.

        Use only when the user wants to save search criteria. Do not invent the feed name, location, category, price range, or other listing query details.

        Feed type values:
        - user: User-facing feed. When creating a feed from agent workflows, use this type.
        - search: Internal/agent-derived saved search type. Do not use this type from agent workflows.

        Listing query enum values:
        - delivery: personal, post, package, other.
        - warranty: warranty, no-warranty, custom.
        - currency: CZK, EUR, USD, GBP, PLN, HUF, CHF.
        - listing sort fields: price, condition, age, createdAt, updatedAt, expiresAt, geo.
    `.trim(),
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
