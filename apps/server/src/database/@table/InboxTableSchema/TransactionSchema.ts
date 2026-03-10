import { z } from "@hono/zod-openapi";
import { InboxSchema } from "./InboxSchema";

export const TransactionSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("message"),
		type: z.literal("transaction"),
		payload: z.looseObject({
			transactionId: z.string().openapi({
				description: "Related transaction identifier",
			}),
			transactionEntryId: z.string().optional().openapi({
				description: "Related transaction entry identifier when available",
			}),
		}),
	})
	.strip()
	.openapi("InboxTransaction");
