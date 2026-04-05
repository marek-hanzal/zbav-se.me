import { tool } from "ai";
import { z } from "zod";
import { draftCollectionFn } from "~/seller/draft/server/fn/draftCollectionFn";
import { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export const toolDraftCollection = tool({
	title: "draft-collection",
	type: "function",
	needsApproval: false,
	description: "Access user's drafts",
	inputSchema: DraftQuerySchema,
	outputSchema: z.array(DraftSchema),
	async execute(data) {
		return draftCollectionFn({
			data,
		});
	},
});
