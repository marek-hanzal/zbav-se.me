import { z } from "@hono/zod-openapi";
import { MessagePayloadSchema } from "~/@user/message/schema/MessagePayloadSchema";
import { MessageTypeEnumSchema } from "~/@user/message/schema/MessageTypeEnumSchema";

export const MessageSchema = z
	.looseObject({
		id: z.string().openapi({
			description: "ID of the message entry",
		}),
		type: MessageTypeEnumSchema,
		payload: MessagePayloadSchema,
	})
	.strip()
	.openapi("Message", {
		description: "Message entry (unified view across all message types)",
	});

export type MessageSchema = typeof MessageSchema;

export namespace MessageSchema {
	export type Type = z.infer<MessageSchema>;
}
