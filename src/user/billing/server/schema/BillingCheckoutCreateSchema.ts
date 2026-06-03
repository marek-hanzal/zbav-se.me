import { z } from "zod";

export const BillingCheckoutCreateSchema = z
	.looseObject({
		bundle: z.string().min(1, "You're missing bundle name"),
		locale: z.string().min(1, "You're missing locale"),
	})
	.strip();

export type BillingCheckoutCreateSchema = typeof BillingCheckoutCreateSchema;

export namespace BillingCheckoutCreateSchema {
	export type Type = z.infer<BillingCheckoutCreateSchema>;
}
