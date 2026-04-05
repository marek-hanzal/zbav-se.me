import { tool } from "ai";
import { CountSchema } from "@/lib/common/schema";
import { draftCountFn } from "~/seller/draft/server/fn/draftCountFn";
import { DraftCountQuerySchema } from "~/seller/draft/server/schema/DraftCountQuerySchema";

export const toolDraftCount = tool({
	title: "draft-count",
	type: "function",
	needsApproval: false,
	description: "Get count of drafts matching filter",
	inputSchema: DraftCountQuerySchema,
	outputSchema: CountSchema,
	async execute(data) {
		return draftCountFn({
			data,
		});
	},
});
