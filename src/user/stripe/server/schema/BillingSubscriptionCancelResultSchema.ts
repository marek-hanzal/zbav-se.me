import { z } from "zod";
import { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";

export const BillingSubscriptionCancelResultSchema = z
	.looseObject({
		bundle: CheckoutBundleEnumSchema,
		expiresAt: z.coerce.date().nullable(),
		subscriptionId: z.string().min(1),
	})
	.strip();

export type BillingSubscriptionCancelResultSchema = typeof BillingSubscriptionCancelResultSchema;

export namespace BillingSubscriptionCancelResultSchema {
	export type Type = z.infer<BillingSubscriptionCancelResultSchema>;
}
