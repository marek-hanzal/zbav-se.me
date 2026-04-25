import { z } from "zod";
import { TextSchema as BaseTextSchema } from "~/server/database/@table/TransactionEntryTableSchema/TextSchema";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";

export const TransactionEntryText = z
	.looseObject({
		...BaseTextSchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
		listingId: z.string().meta({
			description: "Listing this entry belongs to",
		}),
	})
	.strip()
	.meta({
		id: "TransactionEntryText",
		description: "Transaction text entry with user-authored message payload",
	});

export type TransactionEntryText = typeof TransactionEntryText;

export namespace TransactionEntryText {
	export type Type = z.infer<TransactionEntryText>;
}
