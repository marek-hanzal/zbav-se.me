import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const ResourceLimitSortSchema = z
	.looseObject({
		field: z.enum([
			"availableAt",
			"createdAt",
			"expiresAt",
			"limit",
			"resourceDefinitionId",
		]),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "ResourceLimitSort",
		description: "Sort object for effective user resource limits",
	});

export type ResourceLimitSortSchema = typeof ResourceLimitSortSchema;

export namespace ResourceLimitSortSchema {
	export type Type = z.infer<ResourceLimitSortSchema>;
}
