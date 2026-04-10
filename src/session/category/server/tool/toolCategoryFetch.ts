import { tool } from "@openai/agents";
import { getRootLogger } from "~/server/log/getRootLogger";
import { categoryFetchFn } from "~/session/category/fn/categoryFetchFn";
import { CategoryQuerySchema } from "~/session/category/server/schema/CategoryQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolCategoryFetch",
]);

export const toolCategoryFetch = tool({
	name: "category-fetch",
	needsApproval: false,
	description: `
        Get a single category by filter; can be also used to search for a category, but this query will
        fail if there is no match; for resolving an optional category use category-collection instead.
    `.trim(),
	parameters: CategoryQuerySchema,
	async execute(data) {
		logger.trace("toolCategoryFetch", {
			data,
		});

		return categoryFetchFn({
			data,
		});
	},
});
