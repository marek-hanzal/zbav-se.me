import { z } from "zod";
import { CursorSchema } from "~/query/schema/CursorSchema";
import { ResourceLimitSortSchema } from "~/user-resource-limit/schema/ResourceLimitSortSchema";
import { ResourceLimitWhereSchema } from "~/user-resource-limit/schema/ResourceLimitWhereSchema";

export const ResourceLimitQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: ResourceLimitWhereSchema.optional(),
		sort: ResourceLimitSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set or overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "ResourceLimitQuery",
		description: "Query object for effective user resource limits",
	});

export type ResourceLimitQuerySchema = typeof ResourceLimitQuerySchema;

export namespace ResourceLimitQuerySchema {
	export type Type = z.infer<ResourceLimitQuerySchema>;
}
