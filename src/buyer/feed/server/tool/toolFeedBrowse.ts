import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { feedCollectionFn } from "~/buyer/feed/fn/feedCollectionFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolFeedBrowse",
]);

const InputSchema = z.looseObject({}).strip();

export const toolFeedBrowse = tool({
	name: "feed-browse",
	needsApproval: false,
	description: `
Browse current buyer's saved feeds.

This is a source of 'feedId'
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolFeedBrowse", {
			input,
		});

		const items = await feedCollectionFn({
			data: {
				where: {
					//
					type: "user",
				},
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
				feedId: item.id,
				name: item.name,
			})),
			{
				header: true,
				delimiter: "\n",
				columns: [
					"feedId",
					"name",
				],
			},
		);
	},
});
