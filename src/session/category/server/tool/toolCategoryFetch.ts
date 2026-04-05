import { tool } from "ai";
import { categoryFetchFn } from "~/session/category/server/fn/categoryFetchFn";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";
import { CategorySchema } from "~/session/category/server/schema/CategorySchema";

export const toolCategoryFetch = tool({
	title: "category-fetch",
	type: "function",
	needsApproval: false,
	description: `
        Get a single category by filter; can be also used to search for a category, but this query will
        fail if there is no match; for resolving an optional category use category-collection instead.
    `.trim(),
	inputSchema: CategoryQuerySchema,
	outputSchema: CategorySchema,
	async execute(data) {
		return categoryFetchFn({
			data,
		});
	},
});
