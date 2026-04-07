import { tool } from "@openai/agents";
import { categoryFetchFn } from "~/session/category/server/fn/categoryFetchFn";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";

export const toolCategoryFetch = tool({
	name: "category-fetch",
	needsApproval: false,
	description: `
        Get a single category by filter; can be also used to search for a category, but this query will
        fail if there is no match; for resolving an optional category use category-collection instead.
    `.trim(),
	parameters: CategoryQuerySchema,
	// outputSchema: CategorySchema,
	async execute(data) {
		return categoryFetchFn({
			data,
		});
	},
});
