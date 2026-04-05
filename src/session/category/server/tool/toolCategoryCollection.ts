import { tool } from "ai";
import { categoryCollectionFn } from "~/session/category/server/fn/categoryCollectionFn";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";
import { CategorySchema } from "~/session/category/server/schema/CategorySchema";

export const toolCategoryCollection = tool({
	title: "category-collection",
	type: "function",
	needsApproval: false,
	description: "Get a list of categories",
	inputSchema: CategoryQuerySchema,
	outputSchema: CategorySchema.array(),
	async execute(data) {
		return categoryCollectionFn({
			data,
		});
	},
});
