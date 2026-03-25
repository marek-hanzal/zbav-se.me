import { z } from "@hono/zod-openapi";

export const UserSideEnumSchema = z
	.enum([
		"seller",
		"buyer",
	])
	.openapi("UserSideEnum", {
		description: "Side of the user",
	});

export type UserSideEnumSchema = typeof UserSideEnumSchema;

export namespace UserSideEnumSchema {
	export type Type = z.infer<UserSideEnumSchema>;
}
