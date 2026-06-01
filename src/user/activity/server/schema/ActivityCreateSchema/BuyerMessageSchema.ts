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
		id: "ActivityBuyerMessageCreate",
	});
