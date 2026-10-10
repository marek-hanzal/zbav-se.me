import { z } from "zod";
import { WhereSchema } from "~/query/schema/WhereSchema";
import { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";

export const ResourceLimitWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		resourceDefinitionId: ResourceDefinitionEnumSchema.optional(),
		resourceDefinitionIdIn: z.array(ResourceDefinitionEnumSchema).optional(),
		userId: z.string().min(1).optional(),
	})
	.strip()
	.meta({
		id: "ResourceLimitWhere",
		description: "App-based filters for effective user resource limits",
	});

export type ResourceLimitWhereSchema = typeof ResourceLimitWhereSchema;

export namespace ResourceLimitWhereSchema {
	export type Type = z.infer<ResourceLimitWhereSchema>;
}
