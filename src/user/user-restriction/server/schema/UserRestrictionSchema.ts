import { z } from "zod";
import { UserRestrictionTableSchema } from "~/server/database/@table/UserRestrictionTableSchema";

export const UserRestrictionSchema = z
	.looseObject({
		...UserRestrictionTableSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "UserRestriction",
		description: "User restriction",
	});

export type UserRestrictionSchema = typeof UserRestrictionSchema;

export namespace UserRestrictionSchema {
	export type Type = z.infer<UserRestrictionSchema>;
}
