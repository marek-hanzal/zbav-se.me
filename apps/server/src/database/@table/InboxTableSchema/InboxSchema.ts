import { z } from "@hono/zod-openapi";
import { InboxFamilyEnumSchema } from "~/@user/inbox/schema/InboxFamilyEnumSchema";
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
		family: InboxFamilyEnumSchema.openapi({
			description: "Logical inbox event family",
		}),
		priority: InboxPriorityEnumSchema,
		archivedAt: z.coerce.date().nullable().openapi({
			description: "Archive timestamp (null = active)",
		}),
	})
	.strip();
