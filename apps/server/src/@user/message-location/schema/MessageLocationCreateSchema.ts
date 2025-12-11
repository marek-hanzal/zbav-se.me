import { z } from "zod";

export const MessageLocationCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a location to",
		}),
		locationId: z.string().openapi({
			description: "The ID of the location",
		}),
		time: z.coerce.date().openapi({
			description: "Time for the location",
			type: "string",
		}),
	})
	.openapi("MessageLocationCreate", {
		description: "Request to create a message location",
	});

export type MessageLocationCreateSchema = typeof MessageLocationCreateSchema;

export namespace MessageLocationCreateSchema {
	export type Type = z.infer<MessageLocationCreateSchema>;
}
