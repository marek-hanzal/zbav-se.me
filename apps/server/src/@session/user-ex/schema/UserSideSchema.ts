import { z } from "@hono/zod-openapi";

export const UserSideSchema = z
	.enum([
		"seller",
		"buyer",
	])
	.openapi("UserSide", {
		description: "User side - whether they are a seller or buyer",
	});

export type UserSideSchema = typeof UserSideSchema;

export namespace UserSideSchema {
	export type Type = z.infer<typeof UserSideSchema>;
}
