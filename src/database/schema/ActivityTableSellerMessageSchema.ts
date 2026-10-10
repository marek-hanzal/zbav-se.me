import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/activity/schema/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/activity/schema/ActivityTypeEnumSchema";
import { ActivitySchema } from "~/database/schema/ActivityTableActivitySchema";

export const SellerMessageSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"transaction",
		]),
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
