import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { listingCollectionFn } from "~/seller/listing/fn/listingCollectionFn";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolListingBrowse",
]);

const InputSchema = z
	.looseObject({
		//
	})
	.strip();

export const toolListingBrowse = tool({
	name: "seller-listing-browse",
	needsApproval: false,
	description: `
Browse current seller user's published listings.

Use it for seller-owned listing lookup and management.
Do not use for buyer-visible marketplace search.
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolListingBrowse", {
			input,
		});

		const query = await InputSchema.parseAsync(input);

		const items = await listingCollectionFn({
			data: {
				...query,
				limit: 10,
			},
		});

		if (!items.length) {
			return "nothing";
		}

		return stringify(
			items.map((item) => ({
				listingId: item.id,
				title: item.title,
				price: item.price,
				category: `${item.category.group} / ${item.category.category}`,
			})),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"listingId",
					"title",
					"price",
					"category",
				],
			},
		);
	},
});
