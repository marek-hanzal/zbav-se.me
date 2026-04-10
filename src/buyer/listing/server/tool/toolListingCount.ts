import { tool } from "@openai/agents";
import { listingCountFn } from "~/buyer/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCount",
]);

export const toolListingCount = tool({
	name: "listing-count",
	needsApproval: false,
	description: `
        Get number of listings using the provided query; you may use this tool to
        check search results before fetching the collection.

        It will provide you interesting values:
        - total: number of listings available (so you know something is there)
        - filter: number of listings available using "filter" (and "where") you provided
        - where: number of listings available using "where" part of the filter
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
