import { z } from "@hono/zod-openapi";

export const UserEventScopeEnumSchema = z
	.enum([
		"user",
		"foreign",
	])
	.openapi("UserEventScopeEnum", {
		description: "Scope of the user event",
	});

export type UserEventScopeEnumSchema = typeof UserEventScopeEnumSchema;

export namespace UserEventScopeEnumSchema {
	export type Type = z.infer<UserEventScopeEnumSchema>;
}
