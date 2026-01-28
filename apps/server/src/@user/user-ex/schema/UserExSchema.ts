import { z } from "@hono/zod-openapi";
import { UserExTableSchema } from "~/database/@table/UserExTableSchema";

export const UserExSchema = z
	.looseObject({
		...UserExTableSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.openapi("UserEx", {
		description: "User extended information",
	});

export type UserExSchema = typeof UserExSchema;

export namespace UserExSchema {
	export type Type = z.infer<UserExSchema>;
}
