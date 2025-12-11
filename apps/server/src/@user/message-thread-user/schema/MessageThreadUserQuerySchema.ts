import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageThreadUserFilterSchema } from "./MessageThreadUserFilterSchema";
import { MessageThreadUserSortSchema } from "./MessageThreadUserSortSchema";

export const MessageThreadUserQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageThreadUserFilterSchema.optional(),
		where: MessageThreadUserFilterSchema.openapi("MessageThreadUserWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageThreadUserSortSchema.array().optional(),
	})
	.openapi("MessageThreadUserQuery", {
		description: "Query object for message thread user",
	});

export type MessageThreadUserQuerySchema = typeof MessageThreadUserQuerySchema;

export namespace MessageThreadUserQuerySchema {
	export type Type = z.infer<MessageThreadUserQuerySchema>;
}
