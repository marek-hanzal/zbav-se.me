import { z } from "zod";
import { ResourceDefinitionFilterSchema } from "./ResourceDefinitionFilterSchema";

export const ResourceDefinitionWhereSchema = z
	.looseObject({
		...ResourceDefinitionFilterSchema.shape,
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
