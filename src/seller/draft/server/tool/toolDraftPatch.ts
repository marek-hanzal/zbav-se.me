import { tool } from "@openai/agents";
import { draftPatchFn } from "~/seller/draft/server/fn/draftPatchFn";
import { DraftToolPatchSchema } from "~/seller/draft/server/schema/DraftToolPatchSchema";

export const toolDraftPatch = tool({
	name: "draft-patch",
	needsApproval: false,
	description: `
        Update an existing draft using an input query (not an ID directly)
    `.trim(),
	parameters: DraftToolPatchSchema,
	// outputSchema: DraftSchema,
	async execute(data) {
		return draftPatchFn({
			data,
		});
	},
});
