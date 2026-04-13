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
	description: "Count seller published listings matching the provided query.",
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
