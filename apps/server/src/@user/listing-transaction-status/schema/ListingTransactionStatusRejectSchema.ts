import { z } from "zod";

export const ListingTransactionStatusRejectSchema = z
	.object({
		listingTransactionId: z.string().openapi({
			description: "The ID of the listing transaction to reject",
		}),
	})
	.openapi("ListingTransactionStatusReject", {
		description: "Request to reject a listing transaction",
	});

export type ListingTransactionStatusRejectSchema = typeof ListingTransactionStatusRejectSchema;

export namespace ListingTransactionStatusRejectSchema {
	export type Type = z.infer<ListingTransactionStatusRejectSchema>;
}
