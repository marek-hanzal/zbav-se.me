import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const UserResourceLimitSortSchema = z
	.looseObject({
		field: z.enum([
			"availableAt",
			"createdAt",
			"expiresAt",
			"limit",
			"reference",
			"resourceDefinitionId",
		]),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "UserResourceLimitSort",
		description: "Sort object for effective user resource limits",
	});

export type UserResourceLimitSortSchema = typeof UserResourceLimitSortSchema;

export namespace UserResourceLimitSortSchema {
	export type Type = z.infer<UserResourceLimitSortSchema>;
}
