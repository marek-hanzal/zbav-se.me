import { z } from "zod";

export const TransactionEntryGalleryQuerySchema = z
	.looseObject({
		where: z
			.object({
				transactionEntryId: z.string().meta({
					description: "Transaction entry identifier linked to the gallery",
				}),
			})
			.meta({
				id: "TransactionEntryGalleryWhere",
				description: "Gallery lookup scoped by transaction entry identifier",
			}),
	})
	.strip()
	.meta({
		id: "TransactionEntryGalleryQuery",
		description: "Query object for transaction-entry gallery fetch",
	});

export type TransactionEntryGalleryQuerySchema = typeof TransactionEntryGalleryQuerySchema;

export namespace TransactionEntryGalleryQuerySchema {
	export type Type = z.infer<TransactionEntryGalleryQuerySchema>;
}
