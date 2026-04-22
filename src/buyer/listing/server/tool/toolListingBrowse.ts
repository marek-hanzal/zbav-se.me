import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { listingCollectionFn } from "~/buyer/listing/fn/listingCollectionFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolListingBrowse",
]);

const InputSchema = ListingToolQuerySchema;

export const toolListingBrowse = tool({
	name: "buyer-listing-browse",
	needsApproval: false,
	description: `
Buyer-visible listings matching the query. Returns subset of listing data for "quick" answers.

Use for buyer-side browsing and search.
Do not use for seller-owned listing management.
Result is already ranked and complete shortlist. Do not repeat unless filters change.

Prefer query filters such as category, location, price, favourite, ignored, feed, or transaction when relevant.
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
				limit: 8,
			},
		});

		if (!items.length) {
			return "nothing";
		}

		return stringify(
			items.map((item) => {
				return {
					id: item.id,
					title: item.title,
					description: item.description?.substring(0, 64),
					price: item.price,
					distance: item.distance?.toFixed(2),
				};
			}),
			{
				header: true,
				delimiter: "\t",
				columns: [
					"id",
					"title",
					"description",
					"distance",
					"price",
				],
			},
		);
	},
});
