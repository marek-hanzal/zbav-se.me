import { z } from "@hono/zod-openapi";
import { UserExDbSchema } from "../../../app/user-ex/schema/UserExDbSchema";

export const UserExSchema = z
	.object({
		...UserExDbSchema.shape,
	})
	.omit({
		userId: true,
	})
	.openapi("UserEx", {
		description: "User extended information",
	});

export type UserExSchema = typeof UserExSchema;

export namespace UserExSchema {
	export type Type = z.infer<UserExSchema>;
}
