import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const ResourceBundleItemTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the resource bundle item row",
		}),
		resourceBundleId: z.string().meta({
			description: "ID of the resource bundle defining the item template",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		amount: z.coerce.number().meta({
			description: "Item amount defined by the resource bundle",
			type: "number",
		}),
		expiresAt: z.coerce.date().nullish().meta({
			description: "Optional expiration date of this resource template row",
		}),
	})
	.meta({
		id: "ResourceBundleItemTable",
		description: "Database row for an item template defined by a resource bundle.",
	})
	.strip();

export type ResourceBundleItemTableSchema = typeof ResourceBundleItemTableSchema;

export namespace ResourceBundleItemTableSchema {
	export type Type = z.infer<ResourceBundleItemTableSchema>;
}
