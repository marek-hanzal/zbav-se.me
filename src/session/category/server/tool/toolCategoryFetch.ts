import { tool } from "@openai/agents";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
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
        Fetch exactly one category by query.

        Use only when you expect one exact category match, ideally by category id. This tool fails when there is no match; for optional or ambiguous category resolution use category-collection instead.

        Sort fields:
        - group: Category group name/order.
        - category: Category name.
        - sort: Explicit category sort order.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(CategoryQuerySchema),
	async execute(data) {
		logger.trace("toolCategoryFetch", {
			data,
		});

		return categoryFetchFn({
			data,
		});
	},
});
