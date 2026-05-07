import { tool } from "@openai/agents-core";
import { EntitySchema } from "@/lib/common/schema";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { listingFetchFn } from "../../fn/listingFetchFn";

const logger = getRootLogger([
	"tool",
	"toolListingDetail",
]);

const InputSchema = EntitySchema;

export const toolListingDetail = tool({
	name: "buyer-listing-detail",
	needsApproval: false,
	description: `
Fetch listing detail if needed.

Hint:
- Always show first markdown image returned by the detail
- If there are more images, tell the user
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolListingDetail", {
			input,
		});

		const { id } = await InputSchema.parseAsync(input);

		return listingFetchFn({
			data: {
				where: {
					id,
				},
			},
		})
			.then((item) => {
				return `
Title: {item.title}
Price: {item.price.toFixed(2)}
Price type: {match(item.priceType)
					.with("open", () => "Accept offers")
					.with("closed", () => "Does not accept offers")
					.with("offer", () => "Offer a price")
					.exhaustive()}

Images:
${item.withImageUrl.join("\n")}

Description:
{item.description}
                `.trim();
			})
			.catch(() => {
				return "nothing";
			});
	},
});
