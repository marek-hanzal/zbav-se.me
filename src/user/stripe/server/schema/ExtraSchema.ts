import { z } from "zod";
import { ResourceBundleFeatureSchema } from "~/common/resource-bundle-feature/server/schema/ResourceBundleFeatureSchema";
import { ResourceBundleItemSchema } from "~/common/resource-bundle-item/server/schema/ResourceBundleItemSchema";
import { ResourceBundleLimitSchema } from "~/common/resource-bundle-limit/server/schema/ResourceBundleLimitSchema";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export const ExtraSchema = z
	.looseObject({
		bundle: ResourceBundleEnumSchema,
		name: z.string().min(1),
		description: z.string().nullable(),
		price: z.coerce.number().nonnegative(),
		currency: z.string().min(1),
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

export type ExtraSchema = typeof ExtraSchema;

export namespace ExtraSchema {
	export type Type = z.infer<ExtraSchema>;
}
