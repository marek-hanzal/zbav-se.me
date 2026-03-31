import { z } from "zod";
import { UserEventScopeEnumSchema } from "~/common/user-event/enum/UserEventScopeEnumSchema";
import { UserEventEnumSchema } from "~/user/user-event/server/schema/UserEventEnumSchema";
import { UserEventSourceEnumSchema } from "~/user/user-event/server/schema/UserEventSourceEnumSchema";

export const UserEventTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the user event",
		}),
		userId: z.string().meta({
			description: "ID of the user",
		}),
		scope: UserEventScopeEnumSchema,
		source: UserEventSourceEnumSchema,
		group: z.string().meta({
			description: "Group of the event",
		}),
		event: UserEventEnumSchema,
		isTerminal: z.boolean().meta({
			description: "Whether this is a terminal (last) event in the sequence",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "UserEventTable",
		description: "Database row for a user event.",
	})
	.strip();

export type UserEventTableSchema = typeof UserEventTableSchema;

export namespace UserEventTableSchema {
	export type Type = z.infer<UserEventTableSchema>;
}
