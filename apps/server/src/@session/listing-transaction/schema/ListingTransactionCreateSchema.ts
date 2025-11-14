import { z } from "@hono/zod-openapi";

export const ListingTransactionCreateSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing to start a transaction for",
		}),
	})
	.openapi("ListingTransactionCreate", {
		description: "Data for creating a new listing transaction",
	});

export type ListingTransactionCreateSchema = typeof ListingTransactionCreateSchema;

export namespace ListingTransactionCreateSchema {
	export type Type = z.infer<ListingTransactionCreateSchema>;
}
