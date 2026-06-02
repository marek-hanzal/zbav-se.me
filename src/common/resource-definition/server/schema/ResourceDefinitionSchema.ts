import { z } from "zod";
import { EntitySchema } from "@/lib/common/schema";
import { ResourceDefinitionTableSchema } from "~/server/database/@table/ResourceDefinitionTableSchema";

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
