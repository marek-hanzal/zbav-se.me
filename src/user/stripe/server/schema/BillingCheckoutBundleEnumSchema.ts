import { z } from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const BillingCheckoutBundleEnumSchema = ResourceBundleEnumSchema.extract([
	ResourceBundleEnumSchema.enum["package:buyer"],
	ResourceBundleEnumSchema.enum["package:seller"],
	ResourceBundleEnumSchema.enum["package:pro"],
	ResourceBundleEnumSchema.enum["package:master"],
	ResourceBundleEnumSchema.enum["extra:token:small"],
	ResourceBundleEnumSchema.enum["extra:token:medium"],
	ResourceBundleEnumSchema.enum["extra:token:large"],
]);

export type BillingCheckoutBundleEnumSchema = typeof BillingCheckoutBundleEnumSchema;

export namespace BillingCheckoutBundleEnumSchema {
	export type Type = z.infer<BillingCheckoutBundleEnumSchema>;
}
