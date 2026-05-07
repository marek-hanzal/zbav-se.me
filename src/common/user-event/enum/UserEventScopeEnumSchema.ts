import { z } from "zod";

export const UserEventScopeEnumSchema = z
	.enum([
		"user",
		"foreign",
	])
	.meta({
		id: "UserEventScopeEnum",
		description: "Scope of the user event",
	});

export type UserEventScopeEnumSchema = typeof UserEventScopeEnumSchema;

export namespace UserEventScopeEnumSchema {
	export type Type = z.infer<UserEventScopeEnumSchema>;
}
