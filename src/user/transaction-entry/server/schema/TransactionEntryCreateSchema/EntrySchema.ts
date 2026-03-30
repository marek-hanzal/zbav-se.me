import { z } from "zod";

export const EntrySchema = z
	.looseObject({
		transactionId: z.string().meta({
			description: "Transaction identifier",
		}),
	})
	.strip()
	.meta({
		id: "TransactionEntryCreateBase",
	});
