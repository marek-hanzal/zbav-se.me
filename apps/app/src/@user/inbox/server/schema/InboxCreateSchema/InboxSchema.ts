import { z } from "zod";
import { InboxFamilyEnumSchema } from "~/@common/inbox/enum/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/@common/inbox/enum/InboxPriorityEnumSchema";

export const InboxSchema = z
	.looseObject({
		userId: z.string().meta({
			description: "Recipient user identifier",
		}),
		reference: z.array(z.string()).optional().meta({
			description: "Optional normalized reference keys used for inbox grouping",
		}),
		family: InboxFamilyEnumSchema,
		priority: InboxPriorityEnumSchema,
	})
	.strip()
	.meta({
		id: "InboxCreateBase",
	});

export type InboxSchema = typeof InboxSchema;

export namespace InboxSchema {
	export type Type = z.infer<InboxSchema>;
}
