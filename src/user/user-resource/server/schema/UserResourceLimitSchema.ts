import { z } from "zod";
import { UserResourceLimitTableSchema } from "~/server/database/@table/UserResourceLimitTableSchema";

export const UserResourceLimitSchema = z
	.looseObject({
		...UserResourceLimitTableSchema.shape,
		isAvailable: z.boolean().meta({
			description: "Whether the row is currently active",
		}),
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "UserResourceLimit",
		description: "Effective user resource limit data",
	});

export type UserResourceLimitSchema = typeof UserResourceLimitSchema;

export namespace UserResourceLimitSchema {
	export type Type = z.infer<UserResourceLimitSchema>;
}
