import { z } from "@hono/zod-openapi";

export const EntrySchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
	})
	.strip()
	.openapi("TransactionEntryCreateBase");
