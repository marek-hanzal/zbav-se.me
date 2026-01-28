import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageTextFilterSchema } from "./MessageTextFilterSchema";
import { MessageTextSortSchema } from "./MessageTextSortSchema";

export const MessageTextQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageTextFilterSchema.optional(),
		where: MessageTextFilterSchema.openapi("MessageTextWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageTextSortSchema.array().optional(),
	})
	.openapi("MessageTextQuery", {
		description: "Query object for listing transaction message",
	});

export type MessageTextQuerySchema = typeof MessageTextQuerySchema;

export namespace MessageTextQuerySchema {
	export type Type = z.infer<MessageTextQuerySchema>;
}
