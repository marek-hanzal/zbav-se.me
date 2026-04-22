import { z } from "zod";
import { UserRestrictionQuerySchema } from "./UserRestrictionQuerySchema";

export const UserRestrictionCountQuerySchema = z
	.looseObject({
		...UserRestrictionQuerySchema.pick({
			filter: true,
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
