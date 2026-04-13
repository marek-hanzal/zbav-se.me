import { tool } from "@openai/agents";
import { draftCreateFn } from "~/seller/draft/fn/draftCreateFn";
import { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolDraftCreate",
]);

export const toolDraftCreate = tool({
	name: "draft-create",
	needsApproval: false,
	description:
		"Create a user-bound saved listing draft from known fields. Do not invent required details.",
	parameters: DraftCreateSchema,
	async execute(data) {
		logger.trace("toolDraftCreate", {
			data,
		});

		return draftCreateFn({
			data,
		});
	},
});
