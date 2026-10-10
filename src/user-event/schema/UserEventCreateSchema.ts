import { z } from "zod";
import { UserEventEnumSchema } from "~/user-event/schema/UserEventEnumSchema";
import { UserEventSourceEnumSchema } from "~/user-event/schema/UserEventSourceEnumSchema";
import { UserEventScopeEnumSchema } from "~/user-event-contract/schema/UserEventScopeEnumSchema";

export const UserEventCreateSchema = z
	.looseObject({
		scope: UserEventScopeEnumSchema,
		source: UserEventSourceEnumSchema,
		group: z.string().meta({
			description: "Group of the event",
		}),
		event: UserEventEnumSchema,
		isTerminal: z.boolean().meta({
			description: "Whether this is a terminal event",
		}),
	})
	.strip()
	.meta({
		id: "UserEventCreate",
		description: "Data for creating a new user event",
	});

export type UserEventCreateSchema = typeof UserEventCreateSchema;

export namespace UserEventCreateSchema {
	export type Type = z.infer<UserEventCreateSchema>;
}
