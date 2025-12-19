import { z } from "zod";

export const MessageSystemCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a system message to",
		}),
		message: z.string().openapi({
			description: "The message content",
		}),
	})
	.openapi("MessageSystemCreate", {
		description: "Request to create a system message",
	});

export type MessageSystemCreateSchema = typeof MessageSystemCreateSchema;

export namespace MessageSystemCreateSchema {
	export type Type = z.infer<MessageSystemCreateSchema>;
}
