import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/common/activity/enum/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import { ActivitySchema } from "./ActivitySchema";

export const BuyerMessageSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"transaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"buyer-message",
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
		id: "ActivityBuyerMessage",
		description: "Activity transaction event for buyer message",
	});

export type BuyerMessageSchema = typeof BuyerMessageSchema;

export namespace BuyerMessageSchema {
	export type Type = z.infer<BuyerMessageSchema>;
}
