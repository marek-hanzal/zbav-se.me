import { z } from "@hono/zod-openapi";
import { InboxSchema } from "./InboxSchema";

export const BuyerMessageSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("transaction"),
		type: z.literal("buyer-message"),
		payload: z
			.looseObject({
				transactionId: z.string().openapi({
					description: "Related transaction identifier",
				}),
				transactionEntryId: z.string().optional().openapi({
					description: "Related transaction entry identifier when available",
				}),
			})
			.strip(),
	})
	.strip();

export type BuyerMessageSchema = typeof BuyerMessageSchema;

export namespace BuyerMessageSchema {
	export type Type = z.infer<BuyerMessageSchema>;
}
