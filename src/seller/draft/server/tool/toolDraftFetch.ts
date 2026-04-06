import { tool } from "ai";
import { draftFetchFn } from "~/seller/draft/server/fn/draftFetchFn";
import { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

export const toolDraftFetch = tool({
	title: "draft-fetch",
	type: "function",
	needsApproval: false,
	description: "Get a single draft by filter",
	inputSchema: DraftToolQuerySchema,
	outputSchema: DraftSchema,
	async execute(data) {
		return draftFetchFn({
			data,
		});
	},
});
