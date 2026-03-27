import type { z } from "zod";
import { InboxTableSchema } from "~/server/database/@table/InboxTableSchema";

export const InboxSchema = InboxTableSchema.meta({
	id: "Inbox",
	description: "Inbox item",
});

export type InboxSchema = typeof InboxSchema;

export namespace InboxSchema {
	export type Type = z.infer<InboxSchema>;
}
