import { tool } from "@openai/agents";
import { listingCountFn } from "~/buyer/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";
import { getRootLogger } from "~/server/log/getRootLogger";

const logger = getRootLogger([
	"tool",
	"toolListingCount",
]);

export const toolListingCount = tool({
	name: "buyer-listing-count",
	needsApproval: false,
	description: "Count buyer-visible listings matching the provided query.",
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
