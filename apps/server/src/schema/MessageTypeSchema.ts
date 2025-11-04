import { z } from "@hono/zod-openapi";

export const MessageTypeSchema = z
	.enum([
		"info",
		"warning",
		"error",
	])
	.openapi("MessageType", {
		description: "Type of message",
	});

export type MessageTypeSchema = typeof MessageTypeSchema;

export namespace MessageTypeSchema {
	export type Type = z.infer<MessageTypeSchema>;
}
