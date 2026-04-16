import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const SellerMessageSchema = z
	.looseObject({
		...ActivitySchema.shape,
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
		id: "ActivitySellerMessageCreate",
	});
