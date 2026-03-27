import { z } from "zod";
import { InboxFamilyEnumSchema } from "~/@common/inbox/enum/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/@common/inbox/enum/InboxPriorityEnumSchema";

export const InboxSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Inbox identifier",
		}),
		userId: z.string().meta({
			description: "Recipient user identifier",
		}),
		reference: z.array(z.string()).meta({
			description: "Normalized reference keys used for inbox grouping",
		}),
		timestamp: z.coerce.date().meta({
			description: "Inbox event timestamp",
			type: "string",
		}),
		family: InboxFamilyEnumSchema,
		priority: InboxPriorityEnumSchema,
		archivedAt: z.coerce.date().nullable().meta({
			description: "Archive timestamp (null = active)",
		}),
	})
	.strip()
	.meta({
		id: "Inbox",
		description: "Inbox table row",
	});

export type InboxSchema = typeof InboxSchema;

export namespace InboxSchema {
	export type Type = z.infer<InboxSchema>;
}
