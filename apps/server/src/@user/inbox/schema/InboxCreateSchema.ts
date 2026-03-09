import { z } from "@hono/zod-openapi";
import { InboxFamilyEnumSchema } from "~/@user/inbox/schema/InboxFamilyEnumSchema";
import { InboxPayloadSchema } from "~/@user/inbox/schema/InboxPayloadSchema";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxCreateSchema = z
	.looseObject({
		userId: z.string().openapi({
			description: "Recipient user identifier",
		}),
		family: InboxFamilyEnumSchema,
		type: InboxTypeEnumSchema,
		payload: InboxPayloadSchema,
		priority: InboxPriorityEnumSchema,
	})
	.strip()
	.openapi("InboxCreate", {
		description: "Create inbox item payload",
	});

export type InboxCreateSchema = typeof InboxCreateSchema;

export namespace InboxCreateSchema {
	export type Type = z.infer<InboxCreateSchema>;
}
