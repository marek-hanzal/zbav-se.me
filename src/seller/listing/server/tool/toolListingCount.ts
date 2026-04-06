import { tool } from "ai";
import { CountSchema } from "@/lib/common/schema";
import { listingCountFn } from "~/seller/listing/server/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/seller/listing/server/schema/ListingToolQuerySchema";

export const toolListingCount = tool({
	title: "listing-count",
	type: "function",
	needsApproval: false,
	description: "Get count of listings matching filter",
	inputSchema: ListingToolQuerySchema,
	outputSchema: CountSchema,
	async execute(data) {
		return listingCountFn({
			data,
		});
	},
});
