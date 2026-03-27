import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";
import { UserEventEnumSchema } from "~/server/database/@enum/UserEventEnumSchema";
import { UserEventScopeEnumSchema } from "~/common/user-event/enum/UserEventScopeEnumSchema";
import { UserEventSourceEnumSchema } from "~/server/database/@enum/UserEventSourceEnumSchema";

export const UserEventFilterSchema = z
	.looseObject({
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
	.strip()
	.openapi("UserEventFilter", {
		description: "Filter object for user event collection",
	});

export type UserEventFilterSchema = typeof UserEventFilterSchema;

export namespace UserEventFilterSchema {
	export type Type = z.infer<UserEventFilterSchema>;
}
