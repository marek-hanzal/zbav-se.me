import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { UserResourceLimitSortSchema } from "./UserResourceLimitSortSchema";
import { UserResourceLimitWhereSchema } from "./UserResourceLimitWhereSchema";

export const UserResourceLimitQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: UserResourceLimitWhereSchema.optional(),
		sort: UserResourceLimitSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set or overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "UserResourceLimitQuery",
		description: "Query object for effective user resource limits",
	});

export type UserResourceLimitQuerySchema = typeof UserResourceLimitQuerySchema;

export namespace UserResourceLimitQuerySchema {
	export type Type = z.infer<UserResourceLimitQuerySchema>;
}
