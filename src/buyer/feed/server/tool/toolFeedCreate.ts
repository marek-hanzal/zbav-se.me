import { tool } from "@openai/agents";
import { z } from "zod";
import { feedCreateFn } from "~/buyer/feed/fn/feedCreateFn";
import { FeedCreateSchema } from "~/buyer/feed/server/schema/FeedCreateSchema";
import { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { ListingSortSchema } from "~/buyer/listing/server/schema/ListingSortSchema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";

const logger = getRootLogger([
	"tool",
	"toolFeedCreate",
]);

const InputSchema = z
	.looseObject({
		...FeedCreateSchema.shape,
		query: z
			.looseObject({
				filter: z
					.looseObject({
						...ListingFilterSchema.shape,
						//
					})
					.pick({
						ageMin: true,
						ageMax: true,
						categoryIdIn: true,
						conditionMin: true,
						conditionMax: true,
						priceMin: true,
						priceMax: true,
						deliveryIn: true,
						fulltext: true,
						range: true,
					})
					.strip(),
				sort: ListingSortSchema.array().optional(),
				meta: ListingMetaSchema.optional(),
			})
			.strip()
			.meta({
				description: "Listing query configuration (what this feed should return)",
			}),
	})
	.omit({
		type: true,
	})
	.strip();

export const toolFeedCreate = tool({
	name: "feed-create",
	needsApproval: false,
	description: `
Create a saved listing search for the current buyer from known query fields.

Use only when the user wants to save search criteria. Do not invent the feed name, location, category, price range, or other listing query details.

Hint:
- If the user provides an address, normalize it and fill query.meta.locationId
- Pay attention to available fields in 'query' field, also in 'query.meta'
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolFeedCreate", {
			data: input,
		});

		const data = await InputSchema.parseAsync(input);

		const { id } = await feedCreateFn({
			data: {
				...data,
				type: "user",
			},
		});

		return `feedId ${id}`;
	},
});
