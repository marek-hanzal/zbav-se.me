import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftPatchFn } from "~/seller/draft/fn/draftPatchFn";
import { DraftToolPatchSchema } from "~/seller/draft/server/schema/DraftToolPatchSchema";

const logger = getRootLogger([
	"tool",
	"toolDraftPatch",
]);

export const toolDraftPatch = tool({
	name: "draft-patch",
	needsApproval: false,
	description: `
Patch one existing saved listing draft selected by a narrow query.

Prefer an exact draft id in query. Do not invent patch fields; patch only fields the user asked to change.

Enum values:
- priceType closed: Fixed price.
- priceType open: Open/negotiable price.
- delivery: personal, post, package, other.
- warranty: warranty, no-warranty, custom.
- currency: CZK, EUR, USD, GBP, PLN, HUF, CHF.
- restriction none: Normal content.
- restriction adult-relaxed: Adult-ish content with relaxed handling.
- restriction adult: Adult content.
- restriction sensitive: Sensitive content.
- restriction restricted: Strongly restricted content.
- expiresAt: 7-days, 14-days, 1-month.
    `.trim(),
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
