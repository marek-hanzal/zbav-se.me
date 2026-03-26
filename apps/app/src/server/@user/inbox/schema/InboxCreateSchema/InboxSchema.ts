import { z } from "@hono/zod-openapi";
import { InboxFamilyEnumSchema } from "~/server/database/@enum/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/server/database/@enum/InboxPriorityEnumSchema";

export const InboxSchema = z
	.looseObject({
		userId: z.string().openapi({
			description: "Recipient user identifier",
		}),
		reference: z.array(z.string()).optional().openapi({
			description: "Optional normalized reference keys used for inbox grouping",
		}),
		family: InboxFamilyEnumSchema,
		priority: InboxPriorityEnumSchema,
	})
	.strip()
	.openapi("InboxCreateBase");

export type InboxSchema = typeof InboxSchema;

export namespace InboxSchema {
	export type Type = z.infer<InboxSchema>;
}
