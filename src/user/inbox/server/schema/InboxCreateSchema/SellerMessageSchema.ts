import { z } from "zod";
import { InboxSchema } from "./InboxSchema";

export const SellerMessageSchema = z
	.looseObject({
		...InboxSchema.shape,
		family: z.literal("transaction"),
		type: z.literal("seller-message"),
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
		id: "InboxSellerMessageCreate",
	});
