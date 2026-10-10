import { z } from "zod";
import { ResourceDefinitionTableSchema } from "~/database/schema/ResourceDefinitionTableSchema";
import { EntitySchema } from "~/entity/schema/EntitySchema";

export const ResourceDefinitionSchema = z
	.looseObject({
		...EntitySchema.shape,
		...ResourceDefinitionTableSchema.shape,
	})
	.strip()
	.meta({
		id: "ResourceDefinition",
		description: "Resource definition data",
	});

export type ResourceDefinitionSchema = typeof ResourceDefinitionSchema;

export namespace ResourceDefinitionSchema {
	export type Type = z.infer<ResourceDefinitionSchema>;
}
