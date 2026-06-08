import { z } from "zod";
import { ResourceBundleFeatureSchema } from "~/common/resource-bundle-feature/server/schema/ResourceBundleFeatureSchema";
import { ResourceBundleItemSchema } from "~/common/resource-bundle-item/server/schema/ResourceBundleItemSchema";
import { ResourceBundleLimitSchema } from "~/common/resource-bundle-limit/server/schema/ResourceBundleLimitSchema";
import { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";

export const BundleSchema = z
	.looseObject({
		bundle: CheckoutBundleEnumSchema,
		name: z.string().min(1),
		description: z.string().nullable(),
		price: z.coerce.number().nonnegative(),
		currency: z.string().min(1),
		interval: z.string().nullable(),
		items: z.array(
			ResourceBundleItemSchema.pick({
				amount: true,
				id: true,
				resourceDefinitionId: true,
			}),
		),
		limits: z.array(
			ResourceBundleLimitSchema.pick({
				id: true,
				resourceDefinitionId: true,
				limit: true,
			}),
		),
		features: z.array(
			ResourceBundleFeatureSchema.pick({
				id: true,
				resourceDefinitionId: true,
			}),
		),
	})
	.strip();

export type BundleSchema = typeof BundleSchema;

export namespace BundleSchema {
	export type Type = z.infer<BundleSchema>;
}
