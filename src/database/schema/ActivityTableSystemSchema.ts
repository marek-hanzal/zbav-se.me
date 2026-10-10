import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/activity/schema/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/activity/schema/ActivityTypeEnumSchema";
import { ActivitySchema } from "~/database/schema/ActivityTableActivitySchema";
import { UserSideEnumSchema } from "~/user-event-contract/schema/UserSideEnumSchema";

export const SystemSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"transaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"system",
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
		id: "ActivitySystem",
		description: "Activity transaction event for system message",
	});

export type SystemSchema = typeof SystemSchema;

export namespace SystemSchema {
	export type Type = z.infer<SystemSchema>;
}
