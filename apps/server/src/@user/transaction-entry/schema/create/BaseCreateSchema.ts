import { z } from "@hono/zod-openapi";

export const BaseCreateSchema = z
	.looseObject({
		transactionId: z.string().openapi({
			description: "Transaction identifier",
		}),
	})
	.openapi("TransactionEntryCreateBase");
