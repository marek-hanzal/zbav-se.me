import { z } from "@hono/zod-openapi";

export const InboxFamilyEnumSchema = z
	.enum([
		"transaction",
		"reaction",
	])
	.openapi("InboxFamilyEnum", {
		description: "Inbox family",
	});

export type InboxFamilyEnumSchema = typeof InboxFamilyEnumSchema;

export namespace InboxFamilyEnumSchema {
	export type Type = z.infer<InboxFamilyEnumSchema>;
}
