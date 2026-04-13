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
	description: "Category lookup for listing/search category resolution. Use small cursors.",
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
