import { z } from "@hono/zod-openapi";

export const MessagePersonalCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a personal message to",
		}),
		name: z.string().openapi({
			description: "Name",
		}),
		phone: z.string().openapi({
			description: "Phone number",
		}),
		email: z.email().openapi({
			description: "Email address",
		}),
		locationId: z.string().openapi({
			description: "ID of the location",
		}),
	})
	.openapi("MessagePersonalCreate", {
		description: "Request to create a personal message",
	});

export type MessagePersonalCreateSchema = typeof MessagePersonalCreateSchema;

export namespace MessagePersonalCreateSchema {
	export type Type = z.infer<MessagePersonalCreateSchema>;
}
