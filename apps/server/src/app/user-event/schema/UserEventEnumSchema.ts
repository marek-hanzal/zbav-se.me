import { z } from "@hono/zod-openapi";

export const UserEventEnumSchema = z
	.enum([
		"like",
		"dislike",
		"transaction.create",
		"transaction.open",
		"transaction.rejected",
		"transaction.closed",
		"transaction.message",
		"transaction.success",
	])
	.openapi("UserEventEnum", {
		description: "Type of user event",
	});

export type UserEventEnumSchema = typeof UserEventEnumSchema;

export namespace UserEventEnumSchema {
	export type Type = z.infer<UserEventEnumSchema>;
}
