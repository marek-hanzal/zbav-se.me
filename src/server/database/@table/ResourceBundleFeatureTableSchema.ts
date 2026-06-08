import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const ResourceBundleFeatureTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the resource bundle feature row",
		}),
		resourceBundleId: z.string().meta({
			description: "ID of the resource bundle providing the feature",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		expiresAt: z.coerce.date().nullish().meta({
			description: "Optional expiration date of this item",
		}),
	})
	.meta({
		id: "ResourceBundleFeatureTable",
		description: "Database row for a feature granted by a resource bundle.",
	})
	.strip();

export type ResourceBundleFeatureTableSchema = typeof ResourceBundleFeatureTableSchema;

export namespace ResourceBundleFeatureTableSchema {
	export type Type = z.infer<ResourceBundleFeatureTableSchema>;
}
