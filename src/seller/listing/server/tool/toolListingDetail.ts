import { tool } from "@openai/agents-core";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { listingFetchFn } from "../../fn/listingFetchFn";

const logger = getRootLogger([
	"tool",
	"toolListingDetail",
]);

const InputSchema = z
	.looseObject({
		listingId: z.string().min(1),
	})
	.strip();

export const toolListingDetail = tool({
	name: "seller-listing-detail",
	needsApproval: false,
	description: `
Fetch seller listing detail based on 'listingId'.

- Don't invent your own 'listingId'
	`.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolListingDetail", {
			input,
		});

		const { listingId: id } = await InputSchema.parseAsync(input);

		return listingFetchFn({
			data: {
				where: {
					id,
				},
			},
		})
			.then((item) => {
				return `
Title: ${item.title}
Price: ${item.price.toFixed(2)}
Category: ${item.category.group} / ${item.category.category}
Location: ${item.location.address}

Images:
${item.gallery.items.length > 0 ? item.gallery.items.map((galleryItem) => galleryItem.upload.url) : "not set"}

Description:
${item.description ?? "not set"}
				`.trim();
			})
			.catch(() => {
				return "nothing";
			});
	},
});
