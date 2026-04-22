import { tool } from "@openai/agents";
import { match } from "ts-pattern";
import { z } from "zod";
import { ModeEnumSchema } from "~/common/agent/enum/ModeEnumSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { categoryCollectionFn } from "~/user/category/fn/categoryCollectionFn";
import { CategoryToolQuerySchema } from "~/user/category/server/schema/CategoryToolQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolCategoryCollection",
]);

const InputSchema = z
	.looseObject({
		query: CategoryToolQuerySchema,
		mode: ModeEnumSchema,
	})
	.strip();

export const toolCategoryCollection = tool({
	name: "category-collection",
	needsApproval: false,
	description: `
Category lookup for listing drafts and listing/search category resolution. Use small cursors.

Use when the user names a category in natural language and you need a category id or candidate
list. Prefer this over category-fetch when the category might not exist or may be ambiguous.

Hint:
- use filter.fulltext to normalize user's input

Sort:
- group: Category group name/order.
- category: Category name.
- sort: Explicit category sort order.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolCategoryCollection", {
			input,
		});

		const { query, mode } = await InputSchema.parseAsync(input);

		const items = await categoryCollectionFn({
			data: {
				...query,
				where: {
					/**
					 * Model can use only available categories
					 */
					withRestriction: true,
				},
				limit: 8,
			},
		});

		return match(mode)
			.with("browse", () => {
				return {
					count: items.length,
					items: items.map((item) => ({
						id: item.id,
						group: item.group,
						category: item.category,
					})),
				} as const;
			})
			.with("detail", () => {
				return {
					count: items.length,
					items,
				} as const;
			})
			.exhaustive();
	},
});
