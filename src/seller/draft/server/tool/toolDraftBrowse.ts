import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { draftCollectionFn } from "~/seller/draft/fn/draftCollectionFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"draft",
	"tool",
	"toolDraftBrowse",
]);

const InputSchema = z
	.looseObject({
		//
	})
	.strip();

export const toolDraftBrowse = tool({
	name: "draft-browse",
	needsApproval: false,
	description: `
Current seller user's saved listing drafts.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolDraftBrowse", {
			input,
		});

		const _data = await InputSchema.parseAsync(input);

		const items = await draftCollectionFn({
			data: {
				sort: [
					{
						field: "updatedAt",
						order: "desc",
					},
				],
				limit: 10,
			},
		});

		if (!items.length) {
			return "nothing";
		}

		return stringify(
			items.map((item) => ({
				draftId: item.id,
				title: item.title,
				category: item.category
					? `${item.category.group} / ${item.category.category}`
					: "not set",
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"draftId",
					"title",
					"category",
				],
			},
		);
	},
});
