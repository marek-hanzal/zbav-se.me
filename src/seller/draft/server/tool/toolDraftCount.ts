import { tool } from "@openai/agents";
import { draftCountFn } from "~/seller/draft/fn/draftCountFn";
import { DraftToolCountQuerySchema } from "~/seller/draft/server/schema/DraftToolCountQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"draft",
	"tool",
	"toolDraftCount",
]);

export const toolDraftCount = tool({
	name: "draft-count",
	needsApproval: false,
	description: `
        Get count of drafts matching filter.

        Input is optional, result is already bound to the current user.
    `.trim(),
	parameters: DraftToolCountQuerySchema,
	async execute(data) {
		logger.trace("toolDraftCount", {
			data,
		});

		return draftCountFn({
			data,
		});
	},
});
