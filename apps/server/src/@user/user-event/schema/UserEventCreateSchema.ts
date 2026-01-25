import { z } from "@hono/zod-openapi";
import { UserEventEnumSchema } from "./UserEventEnumSchema";
import { UserEventScopeEnumSchema } from "./UserEventScopeEnumSchema";
import { UserEventSourceEnumSchema } from "./UserEventSourceEnumSchema";

export const UserEventCreateSchema = z
	.looseObject({
		scope: UserEventScopeEnumSchema.openapi({
			description: "Scope of the event",
		}),
		source: UserEventSourceEnumSchema,
		group: z.string().openapi({
			description: "Group of the event",
		}),
		event: UserEventEnumSchema,
		isTerminal: z.boolean().openapi({
			description: "Whether this is a terminal event",
		}),
	})
	.strip()
	.openapi("UserEventCreate", {
		description: "Data for creating a new user event",
	});

export type UserEventCreateSchema = typeof UserEventCreateSchema;

export namespace UserEventCreateSchema {
	export type Type = z.infer<UserEventCreateSchema>;
}
