import { tool } from "@openai/agents";
import { draftCollectionFn } from "~/seller/draft/server/fn/draftCollectionFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

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
	// outputSchema: z.array(DraftSchema),
	async execute(data) {
		return draftCollectionFn({
			data,
		});
	},
});
