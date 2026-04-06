import { tool } from "ai";
import { draftDeleteFn } from "~/seller/draft/server/fn/draftDeleteFn";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

export const toolDraftDelete = tool({
	title: "draft-delete",
	type: "function",
	needsApproval: false,
	description: "Delete a draft",
	inputSchema: DraftToolQuerySchema,
	outputSchema: DraftSchema,
	async execute(data) {
		return draftDeleteFn({
			data,
		});
	},
});
