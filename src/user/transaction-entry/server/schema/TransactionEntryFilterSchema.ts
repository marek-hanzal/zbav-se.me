import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";

export const TransactionEntryFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
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
		id: "TransactionEntryFilter",
		description: "Transaction entry collection filters",
	});

export type TransactionEntryFilterSchema = typeof TransactionEntryFilterSchema;

export namespace TransactionEntryFilterSchema {
	export type Type = z.infer<TransactionEntryFilterSchema>;
}
