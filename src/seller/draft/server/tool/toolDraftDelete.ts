import { tool } from "ai";
import { draftDeleteFn } from "~/seller/draft/server/fn/draftDeleteFn";
import { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export const toolDraftDelete = tool({
	title: "draft-delete",
	type: "function",
	needsApproval: false,
	description: "Delete a draft",
	inputSchema: DraftQuerySchema,
	outputSchema: DraftSchema,
	async execute(data) {
		return draftDeleteFn({
			data,
		});
	},
});
