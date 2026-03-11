import { z } from "@hono/zod-openapi";
import { InboxFamilyEnumSchema } from "~/@user/inbox/schema/InboxFamilyEnumSchema";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";

export const InboxSchema = z
	.looseObject({
		userId: z.string().openapi({
			description: "Recipient user identifier",
		}),
		reference: z.string().openapi({
			description: "Normalized reference key used for inbox grouping",
		}),
		family: InboxFamilyEnumSchema,
		priority: InboxPriorityEnumSchema,
	})
	.strip()
	.openapi("InboxCreateBase");
