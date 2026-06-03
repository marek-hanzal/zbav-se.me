import z from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

/**
 * TODO: Remove, we should use stripe as single source of truth
 * TODO: Remove whole file, no need for this
 */

export const BillingStripeBundleSchema = z.enum([
	"bundle:buyer",
]);

export type BillingStripeBundleSchema = typeof BillingStripeBundleSchema;

export namespace BillingStripeBundleSchema {
	export type Type = z.infer<BillingStripeBundleSchema>;
}

export const BillingStripeBundleResourceBundleSchema = z.record(
	BillingStripeBundleSchema,
	ResourceBundleEnumSchema,
);

export const BillingStripeBundleResourceBundle = {
	"bundle:buyer": ResourceBundleEnumSchema.enum["package:buyer"],
} satisfies z.infer<typeof BillingStripeBundleResourceBundleSchema>;
