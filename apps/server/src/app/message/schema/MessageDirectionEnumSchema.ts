import { z } from "@hono/zod-openapi";

export const MessageDirectionEnumSchema = z
	.enum([
		"incoming",
		"outgoing",
		"system",
	])
	.openapi("MessageDirectionEnum", {
		description: "Direction of the message",
	});

export type MessageDirectionEnumSchema = typeof MessageDirectionEnumSchema;

export namespace MessageDirectionEnumSchema {
	export type Type = z.infer<MessageDirectionEnumSchema>;
}
