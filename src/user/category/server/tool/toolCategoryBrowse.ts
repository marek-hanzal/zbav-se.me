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
				filter: {
					fulltext: query,
				},
				where: {
					/**
					 * Model can use only available categories
					 */
					withRestriction: true,
				},
				limit: 3,
			},
		});

		if (!items.length) {
			return "nothing";
		}

		return stringify(
			items.map((item) => ({
				id: item.id,
				group: item.group,
				category: item.category,
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"id",
					"group",
					"category",
				],
			},
		);
	},
});
