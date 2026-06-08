import { z } from "zod";
import { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";

export const BillingSubscriptionCancelSchema = z
	.looseObject({
		bundle: CheckoutBundleEnumSchema,
	})
	.strip();

export type BillingSubscriptionCancelSchema = typeof BillingSubscriptionCancelSchema;

export namespace BillingSubscriptionCancelSchema {
	export type Type = z.infer<BillingSubscriptionCancelSchema>;
}
