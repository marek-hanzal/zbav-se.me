import { z } from "@hono/zod-openapi";

export const MessageSystemCreateSchema = z
	.looseObject({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a system message to",
		}),
		text: z.string().openapi({
			description: "The message content",
		}),
	})
	.strip()
	.openapi("MessageSystemCreate", {
		description: "Request to create a system message",
	});

export type MessageSystemCreateSchema = typeof MessageSystemCreateSchema;

export namespace MessageSystemCreateSchema {
	export type Type = z.infer<MessageSystemCreateSchema>;
}
