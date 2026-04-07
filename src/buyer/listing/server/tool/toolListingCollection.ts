import { tool } from "ai";
import { z } from "zod";
import { listingCollectionFn } from "~/buyer/listing/server/fn/listingCollectionFn";
import { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { ListingToolQuerySchema } from "~/buyer/listing/server/schema/ListingToolQuerySchema";

export const toolListingCollection = tool({
	title: "listing-collection",
	type: "function",
	needsApproval: false,
	description: "Access user's listings",
	inputSchema: ListingToolQuerySchema,
	outputSchema: z.array(ListingSchema),
	async execute(data) {
		return listingCollectionFn({
			data,
		});
	},
});
