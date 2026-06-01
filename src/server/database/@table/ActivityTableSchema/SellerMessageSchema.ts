import { z } from "zod";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import { ActivitySchema } from "./ActivitySchema";

export const SellerMessageSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("transaction"),
		type: ActivityTypeEnumSchema.extract([
			"seller-message",
		]),
		payload: z
			.looseObject({
				transactionId: z.string().meta({
					description: "Related transaction identifier",
				}),
				transactionEntryId: z.string().optional().meta({
					description: "Related transaction entry identifier when available",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "ActivitySellerMessage",
		description: "Activity transaction event for seller message",
	});

export type SellerMessageSchema = typeof SellerMessageSchema;

export namespace SellerMessageSchema {
	export type Type = z.infer<SellerMessageSchema>;
}
