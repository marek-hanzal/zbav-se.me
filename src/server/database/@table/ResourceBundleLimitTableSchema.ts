import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const ResourceBundleLimitTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the resource bundle limit row",
		}),
		resourceBundleId: z.string().meta({
			description: "ID of the resource bundle defining the limit template",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		limit: z.coerce.number().meta({
			description: "Limit value defined by the resource bundle",
			type: "number",
		}),
		expiresAt: z.coerce.date().nullish().meta({
			description: "Optional expiration date of this resource template row",
		}),
	})
	.meta({
		id: "ResourceBundleLimitTable",
		description: "Database row for a resource limit template defined by a resource bundle.",
	})
	.strip();

export type ResourceBundleLimitTableSchema = typeof ResourceBundleLimitTableSchema;

export namespace ResourceBundleLimitTableSchema {
	export type Type = z.infer<ResourceBundleLimitTableSchema>;
}
