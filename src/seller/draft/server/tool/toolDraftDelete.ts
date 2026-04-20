import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftDeleteFn } from "~/seller/draft/fn/draftDeleteFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolDraftDelete",
]);

export const toolDraftDelete = tool({
	name: "draft-delete",
	needsApproval: false,
	description: `
Delete saved listing drafts selected by a narrow query.

Use only after clear user intent to delete. Prefer an exact draft
id; if using name/title-like filters, first confirm the target with draft-collection.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(
		DraftToolQuerySchema.pick({
			filter: true,
		}),
	),
	async execute(data) {
		logger.trace("toolDraftDelete", {
			data,
		});

		return draftDeleteFn({
			data,
		});
	},
});
