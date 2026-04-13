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
        Get the number of buyer listings that match the provided query.

        Use this before fetching the collection when you want to know how many results are
        available or whether the filter is too narrow.
    `.trim(),
	parameters: ListingToolQuerySchema,
	async execute(data) {
		logger.trace("toolListingCount", {
			data,
		});

		return listingCountFn({
			data,
		});
	},
});
