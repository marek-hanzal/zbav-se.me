import { z } from "@hono/zod-openapi";
import { MessageTypeEnumSchema } from "./MessageTypeEnumSchema";

export const MessageSchema = z
	.object({
		message: z.string().openapi({
			description: "Message",
		}),
		type: MessageTypeEnumSchema,
	})
	.openapi("Message", {
		description: "Message data",
	});

export type MessageSchema = typeof MessageSchema;

export namespace MessageSchema {
	export type Type = z.infer<MessageSchema>;
}
