import { z } from "zod";

export const MessageCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the listing transaction to add a message to",
		}),
		message: z.string().openapi({
			description: "The message content",
		}),
	})
	.openapi("MessageCreate", {
		description: "Request to create a listing transaction message",
	});

export type MessageCreateSchema = typeof MessageCreateSchema;

export namespace MessageCreateSchema {
	export type Type = z.infer<MessageCreateSchema>;
}
