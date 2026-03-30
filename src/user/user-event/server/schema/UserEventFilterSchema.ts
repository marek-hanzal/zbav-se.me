import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";
import { UserEventScopeEnumSchema } from "~/common/user-event/enum/UserEventScopeEnumSchema";
import { UserEventEnumSchema } from "~/user/user-event/server/schema/UserEventEnumSchema";
import { UserEventSourceEnumSchema } from "~/user/user-event/server/schema/UserEventSourceEnumSchema";

export const UserEventFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches the exact userId",
		}),
		scope: UserEventScopeEnumSchema.optional().meta({
			description: "This filter matches the exact scope",
		}),
		source: UserEventSourceEnumSchema.optional().meta({
			description: "This filter matches the exact source",
		}),
		group: z.string().optional().meta({
			description: "This filter matches the exact group",
		}),
		event: UserEventEnumSchema.optional().meta({
			description: "This filter matches the exact event",
		}),
		isTerminal: z.boolean().optional().meta({
			description: "This filter matches the exact isTerminal value",
		}),
		cutoff: z.number().optional().meta({
			description: "Number of days to look back from the current time",
		}),
	})
	.strip()
	.meta({
		id: "UserEventFilter",
		description: "Filter object for user event collection",
	});

export type UserEventFilterSchema = typeof UserEventFilterSchema;

export namespace UserEventFilterSchema {
	export type Type = z.infer<UserEventFilterSchema>;
}
