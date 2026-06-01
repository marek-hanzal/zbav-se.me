import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const ResourceLimitSchema = z
	.looseObject({
		id: z.string(),
		resourceDefinitionId: ResourceDefinitionEnumSchema,
		createdAt: z.coerce.date(),
		availableAt: z.coerce.date(),
		expiresAt: z.coerce.date().nullable(),
		limit: z.coerce.number(),
	})
	.strip()
	.meta({
		id: "ResourceLimit",
		description: "Effective user resource limit data",
	});

export type ResourceLimitSchema = typeof ResourceLimitSchema;

export namespace ResourceLimitSchema {
	export type Type = z.infer<ResourceLimitSchema>;
}
