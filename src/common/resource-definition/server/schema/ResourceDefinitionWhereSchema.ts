import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { ResourceDefinitionEnumSchema } from "../../enum/ResourceDefinitionEnumSchema";

export const ResourceDefinitionWhereSchema = z
	.looseObject({
		...FilterSchema.shape,
		name: ResourceDefinitionEnumSchema.optional().meta({
			description: "Exact resource definition name",
		}),
		nameIn: z.array(ResourceDefinitionEnumSchema).min(1).optional().meta({
			description: "Collection of resource definition names",
		}),
	})
	.strip()
	.meta({
		id: "ResourceDefinitionWhere",
		description: "App-based resource definition filters",
	});

export type ResourceDefinitionWhereSchema = typeof ResourceDefinitionWhereSchema;

export namespace ResourceDefinitionWhereSchema {
	export type Type = z.infer<ResourceDefinitionWhereSchema>;
}
