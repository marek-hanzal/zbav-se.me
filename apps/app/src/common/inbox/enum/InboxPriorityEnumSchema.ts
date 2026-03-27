import { z } from "@hono/zod-openapi";

export const InboxPriorityEnumSchema = z
	.enum([
		"common",
		"high",
	])
	.openapi("InboxPriorityEnum", {
		description: "Inbox priority level",
	});

export type InboxPriorityEnumSchema = typeof InboxPriorityEnumSchema;

export namespace InboxPriorityEnumSchema {
	export type Type = z.infer<InboxPriorityEnumSchema>;
}
