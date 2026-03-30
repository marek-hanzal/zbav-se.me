import { z } from "zod";

export const InboxPriorityEnumSchema = z
	.enum([
		"common",
		"high",
	])
	.meta({
		id: "InboxPriorityEnum",
		description: "Inbox priority level",
	});

export type InboxPriorityEnumSchema = typeof InboxPriorityEnumSchema;

export namespace InboxPriorityEnumSchema {
	export type Type = z.infer<InboxPriorityEnumSchema>;
}
