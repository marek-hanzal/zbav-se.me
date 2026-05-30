import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { ResourceDefinitionSortSchema } from "./ResourceDefinitionSortSchema";
import { ResourceDefinitionWhereSchema } from "./ResourceDefinitionWhereSchema";

export const ResourceDefinitionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: ResourceDefinitionWhereSchema.optional(),
		where: ResourceDefinitionWhereSchema.optional(),
		sort: ResourceDefinitionSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set or overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "ResourceDefinitionQuery",
		description: "Query object for resource definitions",
	});

export type ResourceDefinitionQuerySchema = typeof ResourceDefinitionQuerySchema;

export namespace ResourceDefinitionQuerySchema {
	export type Type = z.infer<ResourceDefinitionQuerySchema>;
}
