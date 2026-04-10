import { tool } from "@openai/agents";
import { listingCountFn } from "~/seller/listing/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";

export const toolListingCount = tool({
	name: "listing-count",
	needsApproval: false,
	description: `
        Get number of listings a seller have published on the marketplace by the provided query object.
    `.trim(),
	parameters: ListingToolQuerySchema,
	// outputSchema: CountSchema,
	async execute(data) {
		return listingCountFn({
			data,
		});
	},
});
