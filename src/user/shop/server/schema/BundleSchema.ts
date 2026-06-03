import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const BundleSchema = z
	.looseObject({
		bundle: z.string().min(1),
		name: z.string().min(1),
		price: z.coerce.number().nonnegative(),
		items: z.array(
			z
				.looseObject({
					resourceDefinitionId: ResourceDefinitionEnumSchema,
					amount: z.coerce.number().positive(),
					expiration: z.coerce.number().nullable(),
				})
				.strip(),
		),
		limits: z.array(
			z
				.looseObject({
					resourceDefinitionId: ResourceDefinitionEnumSchema,
					limit: z.coerce.number().positive(),
				})
				.strip(),
		),
	})
	.strip();

export type BundleSchema = typeof BundleSchema;

export namespace BundleSchema {
	export type Type = z.infer<BundleSchema>;
}
