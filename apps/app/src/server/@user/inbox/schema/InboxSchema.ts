import type { z } from "@hono/zod-openapi";
import { InboxTableSchema } from "~/database/@table/InboxTableSchema";

export const InboxSchema = InboxTableSchema.openapi("Inbox", {
	description: "Inbox item",
});

export type InboxSchema = typeof InboxSchema;

export namespace InboxSchema {
	export type Type = z.infer<InboxSchema>;
}
