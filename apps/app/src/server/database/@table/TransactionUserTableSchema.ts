import { z } from "zod";
import { TransactionSideEnumSchema } from "~/common/user-transaction/enum/TransactionSideEnumSchema";

export const TransactionUserTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the transaction user entry",
		}),
		transactionId: z.string().meta({
			description: "ID of the parent transaction",
		}),
		userId: z.string().meta({
			description: "ID of the participant user",
		}),
		side: TransactionSideEnumSchema,
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "TransactionUserTable",
		description: "Database row for a transaction participant.",
	})
	.strip();

export type TransactionUserTableSchema = typeof TransactionUserTableSchema;

export namespace TransactionUserTableSchema {
	export type Type = z.infer<TransactionUserTableSchema>;
}
