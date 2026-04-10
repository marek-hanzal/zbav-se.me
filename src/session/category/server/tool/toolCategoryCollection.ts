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
        Get a list of categories; usable also for resolving category candidates for listing, search and
        others who need a category.
    `.trim(),
	parameters: CategoryQuerySchema,
	async execute(data) {
		logger.trace("toolCategoryCollection", {
			data,
		});

		return categoryCollectionFn({
			data,
		});
	},
});
