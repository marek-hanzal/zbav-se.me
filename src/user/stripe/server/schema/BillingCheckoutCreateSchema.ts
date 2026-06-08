import { z } from "zod";
import { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";

export const BillingCheckoutCreateSchema = z
	.looseObject({
		bundle: CheckoutBundleEnumSchema,
		locale: z.string().min(1, "You're missing locale"),
	})
	.strip();

export type BillingCheckoutCreateSchema = typeof BillingCheckoutCreateSchema;

export namespace BillingCheckoutCreateSchema {
	export type Type = z.infer<BillingCheckoutCreateSchema>;
}
