import { tool } from "ai";
import { draftCreateFn } from "~/seller/draft/server/fn/draftCreateFn";
import { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export const toolDraftCreate = tool({
	title: "draft-create",
	type: "function",
	needsApproval: false,
	description: "Create a new draft",
	inputSchema: DraftCreateSchema,
	outputSchema: DraftSchema,
	async execute(data) {
		return draftCreateFn({
			data,
		});
	},
});
