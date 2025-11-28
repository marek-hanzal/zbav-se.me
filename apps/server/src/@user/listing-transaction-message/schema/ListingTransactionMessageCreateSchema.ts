import { z } from "zod";

export const ListingTransactionMessageCreateSchema = z
	.object({
		listingTransactionId: z.string().openapi({
			description: "The ID of the listing transaction to add a message to",
		}),
		message: z.string().openapi({
			description: "The message content",
		}),
	})
	.openapi("ListingTransactionMessageCreate", {
		description: "Request to create a listing transaction message",
	});

export type ListingTransactionMessageCreateSchema = typeof ListingTransactionMessageCreateSchema;

export namespace ListingTransactionMessageCreateSchema {
	export type Type = z.infer<ListingTransactionMessageCreateSchema>;
}
