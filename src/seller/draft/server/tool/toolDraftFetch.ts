import { tool } from "ai";
import { draftFetchFn } from "~/seller/draft/server/fn/draftFetchFn";
import { DraftQuerySchema } from "~/seller/draft/server/schema/DraftQuerySchema";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export const toolDraftFetch = tool({
	title: "draft-fetch",
	type: "function",
	needsApproval: false,
	description: "Get a single draft by filter",
	inputSchema: DraftQuerySchema,
	outputSchema: DraftSchema,
	async execute(data) {
		return draftFetchFn({
			data,
		});
	},
});
