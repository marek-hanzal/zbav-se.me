import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { categoryCollectionFn } from "~/user/category/fn/categoryCollectionFn";

const logger = getRootLogger([
	"tool",
	"toolCategoryBrowse",
]);

const InputSchema = z
	.looseObject({
		query: z.string(),
	})
	.strip();

export const toolCategoryBrowse = tool({
	name: "category-browse",
	needsApproval: false,
	description: `
Category lookup for listing drafts and listing/search category resolution. Use small cursors.

Use when the user names a category in natural language and you need a category id or candidate
list.

Available:
- not available: user can use category e.g. only for draft creation
- ready to use: category is free to use in any way
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolCategoryBrowse", {
			input,
		});

		const { query } = await InputSchema.parseAsync(input);

		const items = await categoryCollectionFn({
			data: {
				where: {
					fulltext: [
						query,
					],
				},
				limit: 20,
			},
		});

		if (!items.length) {
			return "nothing";
		}

		return stringify(
			items.map((item) => ({
				categoryId: item.id,
				group: item.group,
				category: item.category,
				available: item.isRestricted ? "not available" : "ready to use",
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"categoryId",
					"group",
					"category",
					"available",
				],
			},
		);
	},
});
