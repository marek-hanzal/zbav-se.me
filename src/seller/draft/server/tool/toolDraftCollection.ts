import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftCollectionFn } from "~/seller/draft/fn/draftCollectionFn";
import { draftCountFn } from "~/seller/draft/fn/draftCountFn";
import { DraftToolQuerySchema } from "~/seller/draft/server/schema/DraftToolQuerySchema";

const logger = getRootLogger([
	"draft",
	"tool",
	"toolDraftCollection",
]);

export const toolDraftCollection = tool({
	name: "draft-collection",
	needsApproval: false,
	description: `
Current seller user's saved listing drafts.

Modes:
- collection: return a small page of matching drafts
- count: return how many matching drafts exist

Use for draft lookup and for finding draft ids before update or delete.
    `.trim(),
	strict: true,
	parameters: z
		.looseObject({
			type: z.enum([
				"count",
				"collection",
			]),
			query: DraftToolQuerySchema,
		})
		.strip(),
	async execute({ type, query }) {
		logger.trace("toolDraftCollection", {
			type,
			query,
		});

		return match(type)
			.with("count", async () => {
				const count = await draftCountFn({
					data: query,
				});

				const hasMore = await draftCountFn({
					data: {},
				});

				return {
					count: count,
					hasMore: hasMore > 0,
				} as const;
			})
			.with("collection", async () => {
				const items = await draftCollectionFn({
					data: {
						...query,
						limit: 8,
					},
				});

				return {
					count: items.length,
					items,
				} as const;
			})
			.exhaustive();
	},
});
