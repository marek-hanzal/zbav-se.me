import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { UserRestrictionFilterSchema } from "./UserRestrictionFilterSchema";
import { UserRestrictionSortSchema } from "./UserRestrictionSortSchema";
import { UserRestrictionWhereSchema } from "./UserRestrictionWhereSchema";

export const UserRestrictionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: UserRestrictionFilterSchema.omit({
			userId: true,
		}).optional(),
		where: UserRestrictionWhereSchema.optional(),
		sort: UserRestrictionSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "UserRestrictionQuery",
		description: "Query object for user restrictions",
	});

export type UserRestrictionQuerySchema = typeof UserRestrictionQuerySchema;

export namespace UserRestrictionQuerySchema {
	export type Type = z.infer<UserRestrictionQuerySchema>;
}
