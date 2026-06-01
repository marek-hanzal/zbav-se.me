import { z } from "zod";
import { ActivityFamilyEnumSchema } from "~/common/activity/enum/ActivityFamilyEnumSchema";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import { UserSideEnumSchema } from "~/common/user-event/enum/UserSideEnumSchema";
import { ActivitySchema } from "./ActivitySchema";

export const UnknownSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: ActivityFamilyEnumSchema.extract([
			"transaction",
		]),
		type: ActivityTypeEnumSchema.extract([
			"unknown",
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
		id: "ActivityUnknown",
		description: "Fallback activity transaction event",
	});

export type UnknownSchema = typeof UnknownSchema;

export namespace UnknownSchema {
	export type Type = z.infer<UnknownSchema>;
}
