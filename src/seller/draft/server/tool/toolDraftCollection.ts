import { tool } from "@openai/agents";
import { draftCollectionFn } from "~/seller/draft/fn/draftCollectionFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"draft",
	"tool",
	"toolDraftCollection",
]);

export const toolDraftCollection = tool({
	name: "draft-collection",
	needsApproval: false,
	description: `
Current seller user's saved listing drafts. Use small cursors and compact filters only.

Use to find draft ids before patching, fetching, or deleting.

Sort:
- createdAt: When the draft was created.
- updatedAt: When the draft was last changed.
    `.trim(),
	strict: true,
	parameters: DraftToolQuerySchema,
	async execute(data) {
		logger.trace("toolDraftCollection", {
			data,
		});

		const items = await draftCollectionFn({
			data: {
				...data,
				limit: 8,
			},
		});

		return {
			count: items.length,
			items,
		};
	},
});
