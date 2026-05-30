import { z } from "zod";
import { UserResourceLimitFilterSchema } from "./UserResourceLimitFilterSchema";

export const UserResourceLimitWhereSchema = z
	.looseObject({
		...UserResourceLimitFilterSchema.shape,
	})
	.omit({
		userId: true,
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
