import { tool } from "@openai/agents";
import { draftCountFn } from "~/seller/draft/server/fn/draftCountFn";
import { DraftToolCountQuerySchema } from "~/seller/draft/server/schema/DraftToolCountQuerySchema";

export const toolDraftCount = tool({
	name: "draft-count",
	needsApproval: false,
	description: `Get count of drafts matching filter`.trim(),
	parameters: DraftToolCountQuerySchema,
	// outputSchema: CountSchema,
	async execute(data) {
		return draftCountFn({
			data,
		});
	},
});
