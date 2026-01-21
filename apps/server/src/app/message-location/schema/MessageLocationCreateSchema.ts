import { z } from "@hono/zod-openapi";

export const MessageLocationCreateSchema = z
	.looseObject({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a location to",
		}),
		locationId: z.string().openapi({
			description: "The ID of the location",
		}),
	})
	.strip()
	.openapi("MessageLocationCreate", {
		description: "Request to create a message location",
	});

export type MessageLocationCreateSchema = typeof MessageLocationCreateSchema;

export namespace MessageLocationCreateSchema {
	export type Type = z.infer<MessageLocationCreateSchema>;
}
