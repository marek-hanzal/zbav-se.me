import { tool } from "@openai/agents";
import { categoryCollectionFn } from "~/session/category/server/fn/categoryCollectionFn";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";

export const toolCategoryCollection = tool({
	name: "category-collection",
	needsApproval: false,
	description: `
        Get a list of categories; usable also for resolving category candidates for listing, search and
        others who need a category.
    `.trim(),
	parameters: CategoryQuerySchema,
	// outputSchema: CategorySchema.array(),
	async execute(data) {
		return categoryCollectionFn({
			data,
		});
	},
});
