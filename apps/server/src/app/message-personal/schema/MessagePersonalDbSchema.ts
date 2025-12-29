import { z } from "@hono/zod-openapi";

export const MessagePersonalDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message personal entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who sent the message",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread referenced by the message",
	}),
	name: z.string().openapi({
		description: "Name",
	}),
	phone: z.string().openapi({
		description: "Phone number",
	}),
	email: z.string().email().openapi({
		description: "Email address",
	}),
	locationId: z.string().openapi({
		description: "ID of the location",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessagePersonalDbSchema = typeof MessagePersonalDbSchema;

export namespace MessagePersonalDbSchema {
	export type Type = z.infer<MessagePersonalDbSchema>;
}
