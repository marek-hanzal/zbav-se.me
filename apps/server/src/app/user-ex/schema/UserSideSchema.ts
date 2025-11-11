import { z } from "@hono/zod-openapi";

export const UserSideSchema = z
	.enum([
		"seller",
		"buyer",
	])
	.openapi("UserSide", {
		description: "Side of the user",
	});

export type UserSideSchema = typeof UserSideSchema;

export namespace UserSideSchema {
	export type Type = z.infer<UserSideSchema>;
}
