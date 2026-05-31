import { z } from "zod";
import { WhereSchema } from "@/lib/common/schema";
import { UserEventScopeEnumSchema } from "~/common/user-event/enum/UserEventScopeEnumSchema";
import { UserEventEnumSchema } from "./UserEventEnumSchema";
import { UserEventSourceEnumSchema } from "./UserEventSourceEnumSchema";

export const UserEventWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
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
		id: "UserEventWhere",
		description: "App-based filters",
	});

export type UserEventWhereSchema = typeof UserEventWhereSchema;

export namespace UserEventWhereSchema {
	export type Type = z.infer<UserEventWhereSchema>;
}
