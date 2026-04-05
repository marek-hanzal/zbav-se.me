import { tool } from "ai";
import { draftPatchFn } from "~/seller/draft/server/fn/draftPatchFn";
import { DraftPatchSchema } from "~/seller/draft/server/schema/DraftPatchSchema";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export const toolDraftPatch = tool({
	title: "draft-patch",
	type: "function",
	needsApproval: false,
	description: "Update an existing draft using an input query (not an ID directly)",
	inputSchema: DraftPatchSchema,
	outputSchema: DraftSchema,
	async execute(data) {
		return draftPatchFn({
			data,
		});
	},
});
