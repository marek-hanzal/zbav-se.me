import { z } from "zod";
import { ResourceBundleFeatureSchema } from "~/common/resource-bundle-feature/server/schema/ResourceBundleFeatureSchema";
import { ResourceBundleItemSchema } from "~/common/resource-bundle-item/server/schema/ResourceBundleItemSchema";
import { ResourceBundleLimitSchema } from "~/common/resource-bundle-limit/server/schema/ResourceBundleLimitSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const PackageActiveSchema = z
	.looseObject({
		cancelAtPeriodEnd: z.boolean(),
		periodEndAt: z.coerce.date().nullable(),
	})
	.strip();

export const PackageSchema = z
	.looseObject({
		active: PackageActiveSchema.nullable(),
		bundle: ResourceBundleEnumSchema,
		name: z.string().min(1),
		description: z.string().nullable(),
		price: z.coerce.number().nonnegative(),
		currency: z.string().min(1),
		interval: z.string().min(1),
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

export type PackageActiveSchema = typeof PackageActiveSchema;
export type PackageSchema = typeof PackageSchema;

export namespace PackageActiveSchema {
	export type Type = z.infer<PackageActiveSchema>;
}

export namespace PackageSchema {
	export type Type = z.infer<PackageSchema>;
}
