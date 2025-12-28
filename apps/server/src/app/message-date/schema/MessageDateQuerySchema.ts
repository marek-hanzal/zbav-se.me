import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageDateFilterSchema } from "./MessageDateFilterSchema";
import { MessageDateSortSchema } from "./MessageDateSortSchema";

export const MessageDateQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageDateFilterSchema.optional(),
		where: MessageDateFilterSchema.openapi("MessageDateWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageDateSortSchema.array().optional(),
	})
	.openapi("MessageDateQuery", {
		description: "Query object for message date",
	});

export type MessageDateQuerySchema = typeof MessageDateQuerySchema;

export namespace MessageDateQuerySchema {
	export type Type = z.infer<MessageDateQuerySchema>;
}
