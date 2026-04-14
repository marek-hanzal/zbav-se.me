import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { categoryCollectionFn } from "~/session/category/fn/categoryCollectionFn";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolCategoryCollection",
]);

export const toolCategoryCollection = tool({
	name: "category-collection",
	needsApproval: false,
	description: `
Category lookup for listing drafts and listing/search category resolution. Use small cursors.

Use when the user names a category in natural language and you need a category id or candidate list. Prefer this over category-fetch when the category might not exist or may be ambiguous.

Sort fields:
- group: Category group name/order.
- category: Category name.
- sort: Explicit category sort order.
    `.trim(),
	parameters: CategoryQuerySchema,
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
