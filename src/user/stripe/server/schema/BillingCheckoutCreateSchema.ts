import { z } from "zod";
import { BillingCheckoutBundleEnumSchema } from "~/user/stripe/server/schema/BillingCheckoutBundleEnumSchema";

export const BillingCheckoutCreateSchema = z
	.looseObject({
		bundle: BillingCheckoutBundleEnumSchema,
		locale: z.string().min(1, "You're missing locale"),
	})
	.strip();

export type BillingCheckoutCreateSchema = typeof BillingCheckoutCreateSchema;

export namespace BillingCheckoutCreateSchema {
	export type Type = z.infer<BillingCheckoutCreateSchema>;
}
