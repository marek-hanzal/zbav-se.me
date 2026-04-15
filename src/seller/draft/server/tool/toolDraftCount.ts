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
Count current seller user's saved listing drafts matching the query.
    `.trim(),
	parameters: DraftToolCountQuerySchema,
	async execute(data) {
		logger.trace("toolDraftCount", {
			data,
		});

		const count = await draftCountFn({
			data,
		});

		const hasMore = await draftCountFn({
			data: {},
		});

		return {
			count: count,
			hasMore: hasMore > 0,
		} as const;
	},
});
