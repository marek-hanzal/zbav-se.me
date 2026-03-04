import { z } from "@hono/zod-openapi";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the inbox entry",
	}),
	userId: z.string().openapi({
		description: "Recipient user identifier",
	}),
	timestamp: z.coerce.date().openapi({
		description: "Inbox event timestamp",
		type: "string",
	}),
	type: InboxTypeEnumSchema,
	payload: z.looseObject({}).openapi({
		description: "Inbox payload",
	}),
	priority: InboxPriorityEnumSchema,
	archivedAt: z.coerce.date().nullable().openapi({
		description: "Archive timestamp (null = active)",
	}),
});

export type InboxTableSchema = typeof InboxTableSchema;

export namespace InboxTableSchema {
	export type Type = z.infer<InboxTableSchema>;
}
