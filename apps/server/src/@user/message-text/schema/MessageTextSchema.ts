import { z } from "@hono/zod-openapi";
import type { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageTextDbSchema } from "~/app/message-text/schema/MessageTextDbSchema";

export const MessageTextSchema = z
	.object({
		...MessageTextDbSchema.shape,
		type: z.literal("text" satisfies MessageTypeEnumSchema.Type).openapi({
			description: "Message type",
		}),
	})
	.openapi("MessageText", {
		description: "Message entry",
	});

export type MessageTextSchema = typeof MessageTextSchema;

export namespace MessageTextSchema {
	export type Type = z.infer<MessageTextSchema>;
}
