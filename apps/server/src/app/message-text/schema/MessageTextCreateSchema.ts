import { z } from "@hono/zod-openapi";

export const MessageTextCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the listing transaction to add a message to",
		}),
		message: z.string().openapi({
			description: "The message content",
		}),
	})
	.openapi("MessageTextCreate", {
		description: "Request to create a listing transaction message",
	});

export type MessageTextCreateSchema = typeof MessageTextCreateSchema;

export namespace MessageTextCreateSchema {
	export type Type = z.infer<MessageTextCreateSchema>;
}
