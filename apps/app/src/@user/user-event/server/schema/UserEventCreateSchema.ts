import { z } from "zod";
import { UserEventScopeEnumSchema } from "~/common/user-event/enum/UserEventScopeEnumSchema";
import { UserEventEnumSchema } from "./UserEventEnumSchema";
import { UserEventSourceEnumSchema } from "./UserEventSourceEnumSchema";

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
