import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const UserResourceLimitWhereSchema = z
	.looseObject({
		...FilterSchema.shape,
		resourceDefinitionId: ResourceDefinitionEnumSchema.optional(),
		resourceDefinitionIdIn: z.array(ResourceDefinitionEnumSchema).optional(),
		reference: z.string().min(1).optional(),
		userId: z.string().min(1).optional(),
	})
	.strip()
	.meta({
		id: "UserResourceLimitWhere",
		description: "App-based filters for effective user resource limits",
	});

export type UserResourceLimitWhereSchema = typeof UserResourceLimitWhereSchema;

export namespace UserResourceLimitWhereSchema {
	export type Type = z.infer<UserResourceLimitWhereSchema>;
}
