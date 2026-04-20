import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftCreateFn } from "~/seller/draft/fn/draftCreateFn";
import { DraftCreateSchema } from "~/seller/draft/server/schema/DraftCreateSchema";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolDraftCreate",
]);

export const toolDraftCreate = tool({
	name: "draft-create",
	needsApproval: false,
	description: `
Create a saved listing draft for the current seller from known fields.

Do not invent required listing details. Leave optional fields absent when the user did not provide them.

Enum values:
- priceType closed: Fixed price.
- priceType open: Open/negotiable price.
- delivery: personal, post, package, other.
- warranty: warranty, no-warranty, custom.
- restriction none: Normal content.
- restriction adult-relaxed: Adult-ish content with relaxed handling.
- restriction adult: Adult content.
- restriction sensitive: Sensitive content.
- restriction restricted: Strongly restricted content.
- expiresAt: 7-days, 14-days, 1-month.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(DraftCreateSchema),
	async execute(data) {
		logger.trace("toolDraftCreate", {
			data,
		});

		return draftCreateFn({
			data,
		});
	},
});
