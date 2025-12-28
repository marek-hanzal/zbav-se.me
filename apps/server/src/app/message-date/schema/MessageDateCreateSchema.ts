import { z } from "@hono/zod-openapi";

export const MessageDateCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a date message to",
		}),
		datetime: z.coerce.date().openapi({
			description: "Date and time",
			type: "string",
		}),
	})
	.openapi("MessageDateCreate", {
		description: "Request to create a date message",
	});

export type MessageDateCreateSchema = typeof MessageDateCreateSchema;

export namespace MessageDateCreateSchema {
	export type Type = z.infer<MessageDateCreateSchema>;
}
