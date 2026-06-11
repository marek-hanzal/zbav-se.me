import { z } from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const BillingSubscriptionCancelResultSchema = z
	.looseObject({
		bundle: ResourceBundleEnumSchema,
		expiresAt: z.coerce.date().nullable(),
		subscriptionId: z.string().min(1),
	})
	.strip();

export type BillingSubscriptionCancelResultSchema = typeof BillingSubscriptionCancelResultSchema;

export namespace BillingSubscriptionCancelResultSchema {
	export type Type = z.infer<BillingSubscriptionCancelResultSchema>;
}
