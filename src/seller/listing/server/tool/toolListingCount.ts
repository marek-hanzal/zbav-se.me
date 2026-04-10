import { tool } from "@openai/agents";
import { listingCountFn } from "~/seller/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCount",
]);

export const toolListingCount = tool({
	name: "listing-count",
	needsApproval: false,
	description: `
        Get number of listings a seller have published on the marketplace by the provided query object.
    `.trim(),
	parameters: ListingToolQuerySchema,
	// outputSchema: CountSchema,
	async execute(data) {
		logger.trace("toolListingCount", {
			data,
		});

		return listingCountFn({
			data,
		});
	},
});
