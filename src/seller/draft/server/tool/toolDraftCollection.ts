import { tool } from "ai";
import { z } from "zod";
import { draftCollectionFn } from "~/seller/draft/server/fn/draftCollectionFn";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

export const toolDraftCollection = tool({
	title: "draft-collection",
	type: "function",
	needsApproval: false,
	description: "Access user's drafts",
	inputSchema: DraftToolQuerySchema,
	outputSchema: z.array(DraftSchema),
	async execute(data) {
		return draftCollectionFn({
			data,
		});
	},
});
