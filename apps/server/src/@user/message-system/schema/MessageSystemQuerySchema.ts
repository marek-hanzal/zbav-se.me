import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageSystemFilterSchema } from "./MessageSystemFilterSchema";
import { MessageSystemSortSchema } from "./MessageSystemSortSchema";

export const MessageSystemQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageSystemFilterSchema.optional(),
		where: MessageSystemFilterSchema.openapi("MessageSystemWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageSystemSortSchema.array().optional(),
	})
	.openapi("MessageSystemQuery", {
		description: "Query object for system message",
	});

export type MessageSystemQuerySchema = typeof MessageSystemQuerySchema;

export namespace MessageSystemQuerySchema {
	export type Type = z.infer<MessageSystemQuerySchema>;
}
