import { z } from "zod";
import { UserExTableSchema } from "~/server/database/@table/UserExTableSchema";

export const UserExSchema = z
	.looseObject({
		...UserExTableSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "UserEx",
		description: "User extended information",
	});

export type UserExSchema = typeof UserExSchema;

export namespace UserExSchema {
	export type Type = z.infer<UserExSchema>;
}
