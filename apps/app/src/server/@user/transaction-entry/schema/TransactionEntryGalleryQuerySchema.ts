import { z } from "@hono/zod-openapi";

export const TransactionEntryGalleryQuerySchema = z
	.looseObject({
		where: z
			.object({
				transactionEntryId: z.string().openapi({
					description: "Transaction entry identifier linked to the gallery",
				}),
			})
			.openapi("TransactionEntryGalleryWhere", {
				description: "Gallery lookup scoped by transaction entry identifier",
			}),
	})
	.strip()
	.openapi("TransactionEntryGalleryQuery", {
		description: "Query object for transaction-entry gallery fetch",
	});

export type TransactionEntryGalleryQuerySchema = typeof TransactionEntryGalleryQuerySchema;

export namespace TransactionEntryGalleryQuerySchema {
	export type Type = z.infer<TransactionEntryGalleryQuerySchema>;
}
