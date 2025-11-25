import { z } from "zod";

export const ListingTransactionStatusAcceptSchema = z
	.object({
		listingTransactionId: z.string().openapi({
			description: "The ID of the listing transaction to accept",
		}),
	})
	.openapi("ListingTransactionStatusAccept", {
		description: "Request to accept a listing transaction",
	});

export type ListingTransactionStatusAcceptSchema = typeof ListingTransactionStatusAcceptSchema;

export namespace ListingTransactionStatusAcceptSchema {
	export type Type = z.infer<ListingTransactionStatusAcceptSchema>;
}
