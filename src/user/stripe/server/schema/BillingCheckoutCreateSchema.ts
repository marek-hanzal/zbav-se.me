import { z } from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const BillingCheckoutCreateSchema = z
	.looseObject({
		bundle: ResourceBundleEnumSchema,
		locale: z.string().min(1, "You're missing locale"),
	})
	.strip();

export type BillingCheckoutCreateSchema = typeof BillingCheckoutCreateSchema;

export namespace BillingCheckoutCreateSchema {
	export type Type = z.infer<BillingCheckoutCreateSchema>;
}
