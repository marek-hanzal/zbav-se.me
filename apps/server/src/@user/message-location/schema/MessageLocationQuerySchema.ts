import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageLocationFilterSchema } from "~/@user/message-location/schema/MessageLocationFilterSchema";
import { MessageLocationSortSchema } from "~/@user/message-location/schema/MessageLocationSortSchema";

export const MessageLocationQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageLocationFilterSchema.optional(),
		where: MessageLocationFilterSchema.openapi("MessageLocationWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageLocationSortSchema.array().optional(),
	})
	.openapi("MessageLocationQuery", {
		description: "Query object for message location",
	});

export type MessageLocationQuerySchema = typeof MessageLocationQuerySchema;

export namespace MessageLocationQuerySchema {
	export type Type = z.infer<MessageLocationQuerySchema>;
}
