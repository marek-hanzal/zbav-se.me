import { tool } from "ai";
import { draftPatchFn } from "~/seller/draft/server/fn/draftPatchFn";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { DraftToolPatchSchema } from "~/seller/draft/server/schema/DraftToolPatchSchema";

export const toolDraftPatch = tool({
	title: "draft-patch",
	type: "function",
	needsApproval: false,
	description: "Update an existing draft using an input query (not an ID directly)",
	inputSchema: DraftToolPatchSchema,
	outputSchema: DraftSchema,
	async execute(data) {
		return draftPatchFn({
			data,
		});
	},
});
