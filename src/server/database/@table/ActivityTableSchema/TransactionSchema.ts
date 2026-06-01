import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/common/activity/enum/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { ActivitySchema } from "./ActivitySchema";

export const TransactionSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"transaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"transaction",
		]),
		payload: z
			.looseObject({
				transactionId: z.string().meta({
					description: "Related transaction identifier",
				}),
				listingId: z.string().meta({
					description: "Related listing identifier for seller-scoped transaction routes",
				}),
				transactionEntryId: z.string().optional().meta({
					description: "Related transaction entry identifier when available",
				}),
				target: UserSideEnumSchema.meta({
					description:
						"Recipient-side transaction detail target used for deep-link routing",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "ActivityTransaction",
		description: "Activity transaction event",
	});

export type TransactionSchema = typeof TransactionSchema;

export namespace TransactionSchema {
	export type Type = z.infer<TransactionSchema>;
}
