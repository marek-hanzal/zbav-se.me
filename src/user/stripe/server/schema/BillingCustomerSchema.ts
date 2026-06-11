import { z } from "zod";

export const BillingCustomerSchema = z
	.looseObject({
		customerId: z.string().min(1),
	})
	.strip();

export type BillingCustomerSchema = typeof BillingCustomerSchema;

export namespace BillingCustomerSchema {
	export type Type = z.infer<BillingCustomerSchema>;
}
