import { getLogger } from "@logtape/logtape";
import { tool } from "@openai/agents";
import { draftCollectionFn } from "~/seller/draft/fn/draftCollectionFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

const logger = getLogger([
	"agent",
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
    `.trim(),
	strict: true,
	parameters: DraftToolQuerySchema,
	async execute(data) {
		logger.trace("toolDraftCollection", {
			data,
		});

		return draftCollectionFn({
			data,
		});
	},
});
