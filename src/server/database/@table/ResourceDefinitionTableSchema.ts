import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const ResourceDefinitionTableSchema = z
	.looseObject({
		name: ResourceDefinitionEnumSchema.meta({
			description: "Unique resource definition name",
		}),
	})
	.meta({
		id: "ResourceDefinitionTable",
		description: "Database row for a resource definition.",
	})
	.strip();

export type ResourceDefinitionTableSchema = typeof ResourceDefinitionTableSchema;

export namespace ResourceDefinitionTableSchema {
	export type Type = z.infer<ResourceDefinitionTableSchema>;
}
