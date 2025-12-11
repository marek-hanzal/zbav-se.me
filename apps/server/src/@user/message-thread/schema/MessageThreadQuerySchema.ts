import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageThreadFilterSchema } from "./MessageThreadFilterSchema";
import { MessageThreadSortSchema } from "./MessageThreadSortSchema";

export const MessageThreadQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageThreadFilterSchema.optional(),
		where: MessageThreadFilterSchema.openapi("MessageThreadWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageThreadSortSchema.array().optional(),
	})
	.openapi("MessageThreadQuery", {
		description: "Query object for message thread",
	});

export type MessageThreadQuerySchema = typeof MessageThreadQuerySchema;

export namespace MessageThreadQuerySchema {
	export type Type = z.infer<MessageThreadQuerySchema>;
}
