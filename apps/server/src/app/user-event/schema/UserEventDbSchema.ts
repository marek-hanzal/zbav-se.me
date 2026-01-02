import { z } from "@hono/zod-openapi";
import { UserEventEnumSchema } from "./UserEventEnumSchema";
import { UserEventScopeEnumSchema } from "./UserEventScopeEnumSchema";
import { UserEventSourceEnumSchema } from "./UserEventSourceEnumSchema";

export const UserEventDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the user event",
	}),
	userId: z.string().openapi({
		description: "ID of the user",
	}),
	scope: UserEventScopeEnumSchema,
	source: UserEventSourceEnumSchema,
	group: z.string().openapi({
		description: "Group of the event",
	}),
	event: UserEventEnumSchema,
	isTerminal: z.boolean().openapi({
		description: "Whether this is a terminal (last) event in the sequence",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type UserEventDbSchema = typeof UserEventDbSchema;

export namespace UserEventDbSchema {
	export type Type = z.infer<UserEventDbSchema>;
}
