import { z } from "@hono/zod-openapi";
import { UserEventEnumSchema } from "~/@user/user-event/schema/UserEventEnumSchema";
import { UserEventScopeEnumSchema } from "~/database/@enum/UserEventScopeEnumSchema";
import { UserEventSourceEnumSchema } from "~/@user/user-event/schema/UserEventSourceEnumSchema";

export const UserEventTableSchema = z.object({
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

export type UserEventTableSchema = typeof UserEventTableSchema;

export namespace UserEventTableSchema {
	export type Type = z.infer<UserEventTableSchema>;
}
