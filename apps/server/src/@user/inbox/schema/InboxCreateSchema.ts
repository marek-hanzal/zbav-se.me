import { z } from "@hono/zod-openapi";
import { InboxPayloadSchema } from "~/@user/inbox/schema/InboxPayloadSchema";
import { InboxPriorityEnumSchema } from "~/database/@enum/InboxPriorityEnumSchema";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxCreateSchema = z
	.looseObject({
		userId: z.string().openapi({
			description: "Recipient user identifier",
		}),
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
