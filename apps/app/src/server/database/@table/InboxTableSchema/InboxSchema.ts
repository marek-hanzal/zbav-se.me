import { z } from "@hono/zod-openapi";
import { InboxFamilyEnumSchema } from "~/server/database/@enum/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/server/database/@enum/InboxPriorityEnumSchema";

export const InboxSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "Inbox identifier",
		}),
		userId: z.string().openapi({
			description: "Recipient user identifier",
		}),
		reference: z.array(z.string()).openapi({
			description: "Normalized reference keys used for inbox grouping",
		}),
		timestamp: z.coerce.date().openapi({
			description: "Inbox event timestamp",
			type: "string",
		}),
		family: InboxFamilyEnumSchema.openapi({
			description: "Logical inbox event family",
		}),
		priority: InboxPriorityEnumSchema,
		archivedAt: z.coerce.date().nullable().openapi({
			description: "Archive timestamp (null = active)",
		}),
	})
	.strip();
