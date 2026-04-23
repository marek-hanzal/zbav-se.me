import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { listingCollectionFn } from "~/buyer/listing/fn/listingCollectionFn";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { ListingFilterSchema } from "../schema/ListingFilterSchema";
import { ListingQuerySchema } from "../schema/ListingQuerySchema";

const logger = getRootLogger([
	"tool",
	"toolListingBrowse",
]);

const InputSchema = z
	.looseObject({
		...ListingQuerySchema.shape,
		filter: z
			.looseObject({
				...ListingFilterSchema.shape,
				expiresAtBefore: z.iso.datetime().optional().meta({
					description:
						"This filter matches listings that expire before the provided date",
					type: "string",
				}),
				expiresAtAfter: z.iso.datetime().optional().meta({
					description: "This filter matches listings that expire after the provided date",
					type: "string",
				}),
			})
			.omit({
				categoryId: true,
				currency: true,
				currencyIn: true,
				expiresAtAfter: true,
				expiresAtBefore: true,
				userId: true,
				idIn: true,
			})
			.strip(),
	})
	.omit({
		where: true,
		limit: true,
	})
	.strip()
	.meta({
		id: "ListingToolQuery",
		description: "Query object for listing tools",
	});

export const toolListingBrowse = tool({
	name: "buyer-listing-browse",
	needsApproval: false,
	description: `
Browse listings, find candidates, sort them.

Hint:
- normalize inputs (e.g. category/location) before using this tool
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
