import { z } from "@hono/zod-openapi";

export const MessageTypeEnumSchema = z
	.enum([
		"text",
		"gallery",
		"location",
		"personal",
		"package",
		"date",
		"system",
	])
	.openapi("MessageTypeEnum", {
		description: "Type of message",
	});

export type MessageTypeEnumSchema = typeof MessageTypeEnumSchema;

export namespace MessageTypeEnumSchema {
	export type Type = z.infer<MessageTypeEnumSchema>;
}
