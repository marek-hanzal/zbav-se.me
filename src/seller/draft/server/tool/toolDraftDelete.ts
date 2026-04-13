import { tool } from "@openai/agents";
import { draftDeleteFn } from "~/seller/draft/fn/draftDeleteFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolDraftDelete",
]);

export const toolDraftDelete = tool({
	name: "draft-delete",
	needsApproval: false,
	description: "Delete drafts by a narrow query only after clear upstream user intent.",
	parameters: DraftToolQuerySchema,
	async execute(data) {
		logger.trace("toolDraftDelete", {
			data,
		});

		return draftDeleteFn({
			data,
		});
	},
});
