import { tool } from "ai";
import { CountSchema } from "@/lib/common/schema";
import { listingCountFn } from "~/buyer/listing/server/fn/listingCountFn";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";

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
