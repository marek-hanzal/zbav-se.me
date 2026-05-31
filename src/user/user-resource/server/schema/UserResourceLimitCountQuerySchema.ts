import { z } from "zod";
import { UserResourceLimitQuerySchema } from "./UserResourceLimitQuerySchema";

export const UserResourceLimitCountQuerySchema = z
	.looseObject({
		...UserResourceLimitQuerySchema.pick({
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "UserResourceLimitCountQuery",
		description: "Query object for effective user resource limit count",
	});

export type UserResourceLimitCountQuerySchema = typeof UserResourceLimitCountQuerySchema;

export namespace UserResourceLimitCountQuerySchema {
	export type Type = z.infer<UserResourceLimitCountQuerySchema>;
}
