import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const ResourceDefinitionSortSchema = z
	.looseObject({
		field: z.enum([
			"name",
		]),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "ResourceDefinitionSort",
		description: "Sort object for resource definitions",
	});

export type ResourceDefinitionSortSchema = typeof ResourceDefinitionSortSchema;

export namespace ResourceDefinitionSortSchema {
	export type Type = z.infer<ResourceDefinitionSortSchema>;
}
