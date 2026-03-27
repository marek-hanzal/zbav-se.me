import { z } from "zod";

export const InboxTypeEnumSchema = z
	.enum([
		"buyer-message",
		"seller-message",
		"transaction",
		"system",
		"unknown",
		"thumb",
		"favourite",
		"unfavourite",
		"flag",
		"unflag",
		"ignore",
		"unignore",
	])
	.meta({
		id: "InboxTypeEnum",
		description: "Inbox type",
	});

export type InboxTypeEnumSchema = typeof InboxTypeEnumSchema;

export namespace InboxTypeEnumSchema {
	export type Type = z.infer<InboxTypeEnumSchema>;
}
