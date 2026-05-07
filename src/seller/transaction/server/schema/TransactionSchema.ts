import { z } from "zod";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { TransactionTableSchema } from "~/server/database/@table/TransactionTableSchema";
import { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const TransactionSchema = z
	.looseObject({
		...TransactionTableSchema.shape,
		// title: z.string().meta({
		// 	description: "Transaction title",
		// }),
		status: TransactionStatusEnumSchema,
		entry: TransactionEntrySchema,
		lastAt: z.coerce.date().meta({
			description: "Timestamp of the latest seller-visible transaction activity",
		}),
		unread: z.coerce.number().int().nonnegative().meta({
			description: "Unread activity buyer-message count for this transaction",
			type: "number",
		}),
		//
		withImageUrl: z.array(z.string()).meta({
			description: "Ordered listing image URLs",
		}),
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "Transaction",
		description: "Transaction data",
	});

export type TransactionSchema = typeof TransactionSchema;

export namespace TransactionSchema {
	export type Type = z.infer<TransactionSchema>;
}
