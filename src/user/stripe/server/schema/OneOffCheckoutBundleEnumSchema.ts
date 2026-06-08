import { z } from "zod";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const OneOffCheckoutBundleEnumSchema = ResourceBundleEnumSchema.extract([
	ResourceBundleEnumSchema.enum["extra:token:small"],
	ResourceBundleEnumSchema.enum["extra:token:medium"],
	ResourceBundleEnumSchema.enum["extra:token:large"],
]);

export type OneOffCheckoutBundleEnumSchema = typeof OneOffCheckoutBundleEnumSchema;

export namespace OneOffCheckoutBundleEnumSchema {
	export type Type = z.infer<OneOffCheckoutBundleEnumSchema>;
}
