import { z } from "zod";
import { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";
import { TransactionTableSchema } from "~/server/database/@table/TransactionTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";

export const TransactionSchema = z
	.looseObject({
		...TransactionTableSchema.shape,
		status: TransactionStatusEnumSchema,
		entry: TransactionEntrySchema,
		unread: z.coerce.number().int().nonnegative().meta({
			description: "Unread activity seller-message count for this transaction",
			type: "number",
		}),
		//
		title: z.string().meta({
			description: "Transaction title",
		}),
		location: LocationSchema,
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
