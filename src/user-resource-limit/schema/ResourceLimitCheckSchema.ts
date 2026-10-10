import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";

export const ResourceLimitCheckSchema = z
	.looseObject({
		resource: ResourceDefinitionEnumSchema,
		count: z.number().nonnegative(),
	})
	.strip();

export type ResourceLimitCheckSchema = typeof ResourceLimitCheckSchema;

export namespace ResourceLimitCheckSchema {
	export type Type = z.infer<ResourceLimitCheckSchema>;
}
