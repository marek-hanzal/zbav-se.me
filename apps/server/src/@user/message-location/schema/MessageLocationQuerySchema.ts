import { z } from "@hono/zod-openapi";
import { MessageLocationFilterSchema } from "~/@user/message-location/schema/MessageLocationFilterSchema";
import { MessageLocationSortSchema } from "~/@user/message-location/schema/MessageLocationSortSchema";
import { MessageLocationWhereSchema } from "~/@user/message-location/schema/MessageLocationWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

export const MessageLocationQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageLocationFilterSchema.optional(),
		where: MessageLocationWhereSchema.optional(),
		sort: MessageLocationSortSchema.array().optional(),
	})
	.openapi("MessageLocationQuery", {
		description: "Query object for message location",
	});

export type MessageLocationQuerySchema = typeof MessageLocationQuerySchema;

export namespace MessageLocationQuerySchema {
	export type Type = z.infer<MessageLocationQuerySchema>;
}
