import { tool } from "@openai/agents";
import { draftFetchFn } from "~/seller/draft/fn/draftFetchFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolDraftFetch",
]);

export const toolDraftFetch = tool({
	name: "draft-fetch",
	needsApproval: false,
	description: `
        Fetch a draft by the query object, e.g. filter by name,
        filter by an ID and so on.

        Use this tool only if you're sure a draft exists (e.g. you've an ID) as this
        tool will fail for drafts not found.

        If you want safer way to fetch a draft, use draft-collection which have the
        same input query but returns a collection of items or an empty array.

        @see draft-collection
    `.trim(),
	parameters: DraftToolQuerySchema,
	async execute(data) {
		logger.trace("toolDraftFetch", {
			data,
		});

		return draftFetchFn({
			data,
		});
	},
});
