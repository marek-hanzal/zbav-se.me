import { z } from "@hono/zod-openapi";

export const InboxTypeEnumSchema = z
	.enum([
		"seller-message",
		"buyer-message",
		"thumb",
	])
	.openapi("InboxTypeEnum", {
		description: "Inbox type",
	});

export type InboxTypeEnumSchema = typeof InboxTypeEnumSchema;

export namespace InboxTypeEnumSchema {
	export type Type = z.infer<InboxTypeEnumSchema>;
}
