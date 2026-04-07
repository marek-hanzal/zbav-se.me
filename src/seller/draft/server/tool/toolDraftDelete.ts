import { tool } from "@openai/agents";
import { draftDeleteFn } from "~/seller/draft/server/fn/draftDeleteFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

export const toolDraftDelete = tool({
	name: "draft-delete",
	needsApproval: false,
	description: `
        This provides an ability to delete user's draft; it's a dangerous action,
        so before you delete one, show user at least title and a few filled properties
        to make sure you're about to delete draft user is about to remove.
    `.trim(),
	parameters: DraftToolQuerySchema,
	// outputSchema: DraftSchema,
	async execute(data) {
		return draftDeleteFn({
			data,
		});
	},
});
