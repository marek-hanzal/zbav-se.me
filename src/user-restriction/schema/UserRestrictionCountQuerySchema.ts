import { z } from "zod";
import { UserRestrictionQuerySchema } from "~/user-restriction/schema/UserRestrictionQuerySchema";

export const UserRestrictionCountQuerySchema = z
	.looseObject({
		...UserRestrictionQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "UserRestrictionCountQuery",
		description: "Query object for user restriction count",
	});

export type UserRestrictionCountQuerySchema = typeof UserRestrictionCountQuerySchema;

export namespace UserRestrictionCountQuerySchema {
	export type Type = z.infer<UserRestrictionCountQuerySchema>;
}
