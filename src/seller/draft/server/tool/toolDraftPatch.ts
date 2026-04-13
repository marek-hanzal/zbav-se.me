import { tool } from "@openai/agents";
import { draftPatchFn } from "~/seller/draft/fn/draftPatchFn";
import { DraftToolPatchSchema } from "~/seller/draft/server/schema/DraftToolPatchSchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolDraftPatch",
]);

export const toolDraftPatch = tool({
	name: "draft-patch",
	needsApproval: false,
	description: "Patch one existing draft selected by a narrow query.",
	parameters: DraftToolPatchSchema,
	async execute(data) {
		logger.trace("toolDraftPatch", {
			data,
		});

		return draftPatchFn({
			data,
		});
	},
});
