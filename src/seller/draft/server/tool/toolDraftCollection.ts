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
        Here you can access user's saved drafts (unpublished listings), so if user asks
        what he has work-in-progress, just check this collection and show titles and a few
        other properties.

        Collection is already bound to the user, so you can call it with empty {} object an
        input.
    `.trim(),
	strict: true,
	parameters: DraftToolQuerySchema,
	async execute(data) {
		logger.trace("toolDraftCollection", {
			data,
		});

		const items = await draftCollectionFn({
			data,
		});

		return {
			count: items.length,
			items,
		};
	},
});
