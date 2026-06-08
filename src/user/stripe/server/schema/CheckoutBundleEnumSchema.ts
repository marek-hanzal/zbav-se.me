import { z } from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const CheckoutBundleEnumSchema = ResourceBundleEnumSchema.extract([
	ResourceBundleEnumSchema.enum["package:buyer"],
	ResourceBundleEnumSchema.enum["package:seller"],
	ResourceBundleEnumSchema.enum["package:pro"],
	ResourceBundleEnumSchema.enum["package:master"],
]);

export type CheckoutBundleEnumSchema = typeof CheckoutBundleEnumSchema;

export namespace CheckoutBundleEnumSchema {
	export type Type = z.infer<CheckoutBundleEnumSchema>;
}
