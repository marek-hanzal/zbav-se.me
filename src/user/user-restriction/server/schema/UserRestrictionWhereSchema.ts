import { z } from "zod";
import { UserRestrictionFilterSchema } from "./UserRestrictionFilterSchema";

export const UserRestrictionWhereSchema = z
	.looseObject({
		...UserRestrictionFilterSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "UserRestrictionWhere",
		description: "App-based user restriction filters",
	});

export type UserRestrictionWhereSchema = typeof UserRestrictionWhereSchema;

export namespace UserRestrictionWhereSchema {
	export type Type = z.infer<UserRestrictionWhereSchema>;
}
