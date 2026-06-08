import { z } from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import { BillingCustomerSchema } from "./BillingCustomerSchema";

export const CheckoutReturnSyncResultSchema = BillingCustomerSchema.extend({
	bundle: ResourceBundleEnumSchema.optional(),
}).strip();

export type CheckoutReturnSyncResultSchema = typeof CheckoutReturnSyncResultSchema;

export namespace CheckoutReturnSyncResultSchema {
	export type Type = z.infer<CheckoutReturnSyncResultSchema>;
}
