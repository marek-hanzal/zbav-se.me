import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { categoryCollectionFn } from "~/session/category/fn/categoryCollectionFn";
import { CategoryToolQuerySchema } from "~/session/category/server/schema/CategoryToolQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolCategoryCollection",
]);

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
	parameters: unsafeJsonSchema(CategoryToolQuerySchema),
	async execute(data) {
		logger.trace("toolCategoryCollection", {
			data,
		});

		const items = await categoryCollectionFn({
			data: {
				...data,
				limit: 8,
			},
		});

		return {
			count: items.length,
			items,
		};
	},
});
