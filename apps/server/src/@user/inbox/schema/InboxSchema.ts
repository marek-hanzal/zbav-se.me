import { z } from "@hono/zod-openapi";
import { InboxPayloadSchema } from "~/@user/inbox/schema/InboxPayloadSchema";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "Inbox identifier",
		}),
		userId: z.string().openapi({
			description: "Recipient user identifier",
		}),
		timestamp: z.coerce.date().openapi({
			description: "Inbox event timestamp",
			type: "string",
		}),
		type: InboxTypeEnumSchema,
		payload: InboxPayloadSchema,
		priority: InboxPriorityEnumSchema,
		archivedAt: z.coerce.date().nullable().optional().openapi({
			description: "Archive timestamp (null/undefined = active)",
		}),
	})
	.strip()
	.openapi("Inbox", {
		description: "Inbox item",
	});

export type InboxSchema = typeof InboxSchema;

export namespace InboxSchema {
	export type Type = z.infer<InboxSchema>;
}
