import { z } from "zod";

export const InboxFamilyEnumSchema = z
	.enum([
		"transaction",
		"reaction",
	])
	.meta({
		id: "InboxFamilyEnum",
		description: "Inbox family",
	});

export type InboxFamilyEnumSchema = typeof InboxFamilyEnumSchema;

export namespace InboxFamilyEnumSchema {
	export type Type = z.infer<InboxFamilyEnumSchema>;
}
