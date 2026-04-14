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
        Fetch exactly one current seller user's saved listing draft by query.

        Use only when you are sure a single draft exists, ideally because you have a draft id. This tool fails when no draft matches. For exploratory lookup, use draft-collection first.

        Sort fields:
        - createdAt: When the draft was created.
        - updatedAt: When the draft was last changed.
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
