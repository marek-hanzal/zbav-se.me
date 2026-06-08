import { z } from "zod";
import { ResourceBundleFeatureSchema } from "~/common/resource-bundle-feature/server/schema/ResourceBundleFeatureSchema";
import { ResourceBundleItemSchema } from "~/common/resource-bundle-item/server/schema/ResourceBundleItemSchema";
import { ResourceBundleLimitSchema } from "~/common/resource-bundle-limit/server/schema/ResourceBundleLimitSchema";

export const BundleSchema = z
	.looseObject({
		bundle: z.string().min(1),
		name: z.string().min(1),
		price: z.coerce.number().nonnegative(),
		items: z.array(
			ResourceBundleItemSchema.pick({
				amount: true,
				id: true,
				resourceDefinitionId: true,
				expiresAt: true,
			}),
		),
		limits: z.array(
			ResourceBundleLimitSchema.pick({
				id: true,
				resourceDefinitionId: true,
				limit: true,
				expiresAt: true,
			}),
		),
		features: z.array(
			ResourceBundleFeatureSchema.pick({
				id: true,
				resourceDefinitionId: true,
				expiresAt: true,
			}),
		),
	})
	.strip();

export type BundleSchema = typeof BundleSchema;

export namespace BundleSchema {
	export type Type = z.infer<BundleSchema>;
}
