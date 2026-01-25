import { z } from "@hono/zod-openapi";
import { UserExDbSchema } from "~/@user/user-ex/schema/UserExDbSchema";

export const UserExSchema = z
	.looseObject({
		...UserExDbSchema.shape,
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
