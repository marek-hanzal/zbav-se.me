import { z } from "@hono/zod-openapi";

export const MessageTextCreateSchema = z
	.looseObject({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a message to",
		}),
		message: z.string().openapi({
			description: "The message content",
		}),
	})
	.strip()
	.openapi("MessageTextCreate", {
		description: "Request to create a message text",
	});

export type MessageTextCreateSchema = typeof MessageTextCreateSchema;

export namespace MessageTextCreateSchema {
	export type Type = z.infer<MessageTextCreateSchema>;
}
