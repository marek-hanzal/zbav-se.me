import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const BuyerMessageSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("transaction"),
		type: z.literal("buyer-message"),
		payload: z.looseObject({
			transactionId: z.string().meta({
				description: "Related transaction identifier",
			}),
			transactionEntryId: z.string().optional().meta({
				description: "Related transaction entry identifier when available",
			}),
		}),
	})
	.strip()
	.meta({
		id: "InboxBuyerMessageCreate",
	});
