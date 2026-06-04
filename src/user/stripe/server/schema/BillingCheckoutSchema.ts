import { z } from "zod";

export const BillingCheckoutSchema = z
	.looseObject({
		url: z.url(),
	})
	.strip();

export type BillingCheckoutSchema = typeof BillingCheckoutSchema;

export namespace BillingCheckoutSchema {
	export type Type = z.infer<BillingCheckoutSchema>;
}
