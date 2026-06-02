import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";
import { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";

export const TransactionEntryWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		transactionId: z.string().optional().meta({
			description: "Matches a concrete transaction identifier",
		}),
		transactionIdIn: z.array(z.string()).optional().meta({
			description: "Matches a concrete transaction identifier",
		}),
		userId: z.string().optional().meta({
			description: "Matches a concrete actor identifier",
		}),
		kind: TransactionEntryKindEnumSchema.optional(),
		kindIn: z.array(TransactionEntryKindEnumSchema).optional().meta({
			description: "Matches any of the provided transaction entry kinds",
		}),
	})
	.strip()
	.meta({
		id: "TransactionEntryWhere",
		description: "App-level filters for transaction entry queries",
	});

export type TransactionEntryWhereSchema = typeof TransactionEntryWhereSchema;

export namespace TransactionEntryWhereSchema {
	export type Type = z.infer<TransactionEntryWhereSchema>;
}
