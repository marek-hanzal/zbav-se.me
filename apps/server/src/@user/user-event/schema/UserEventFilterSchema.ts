import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";
import { UserEventEnumSchema } from "~/@common/user-event/schema/UserEventEnumSchema";
import { UserEventScopeEnumSchema } from "./UserEventScopeEnumSchema";
import { UserEventSourceEnumSchema } from "./UserEventSourceEnumSchema";

export const UserEventFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		scope: UserEventScopeEnumSchema.optional().openapi({
			description: "This filter matches the exact scope",
		}),
		source: UserEventSourceEnumSchema.optional().openapi({
			description: "This filter matches the exact source",
		}),
		group: z.string().optional().openapi({
			description: "This filter matches the exact group",
		}),
		event: UserEventEnumSchema.optional().openapi({
			description: "This filter matches the exact event",
		}),
		isTerminal: z.boolean().optional().openapi({
			description: "This filter matches the exact isTerminal value",
		}),
		cutoff: z.number().optional().openapi({
			description: "Number of days to look back from the current time",
		}),
	})
	.openapi("UserEventFilter", {
		description: "Filter object for user event collection",
	});

export type UserEventFilterSchema = typeof UserEventFilterSchema;

export namespace UserEventFilterSchema {
	export type Type = z.infer<UserEventFilterSchema>;
}
