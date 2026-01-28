import { z } from "@hono/zod-openapi";

export const UserEventSourceEnumSchema = z
	.enum([
		"listing",
		"transaction",
	])
	.openapi("UserEventSourceEnum", {
		description: "Source of the user event",
	});

export type UserEventSourceEnumSchema = typeof UserEventSourceEnumSchema;

export namespace UserEventSourceEnumSchema {
	export type Type = z.infer<UserEventSourceEnumSchema>;
}
