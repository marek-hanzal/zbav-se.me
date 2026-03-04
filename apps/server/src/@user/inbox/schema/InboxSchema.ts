import { z } from "@hono/zod-openapi";
import { InboxPayloadSchema } from "~/@user/inbox/schema/InboxPayloadSchema";
import { InboxTypeEnumSchema } from "~/@user/inbox/schema/InboxTypeEnumSchema";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";

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
		archivedAt: z
			.union([
				z.null(),
				z.coerce.date(),
			])
			.optional()
			.openapi({
				description: "Archive timestamp (null/undefined = active)",
				type: "string",
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
