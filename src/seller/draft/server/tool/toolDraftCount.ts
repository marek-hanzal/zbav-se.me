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
	description: "Count user-bound drafts matching the provided query.",
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
