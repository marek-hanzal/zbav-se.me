import { z } from "@hono/zod-openapi";
import { MessageLocationFilterSchema } from "~/@user/message-location/schema/MessageLocationFilterSchema";

export const MessageLocationWhereSchema = z
	.object({
		...MessageLocationFilterSchema.shape,
	})
	.openapi("MessageLocationWhere", {
		description: "App-based filters",
	});

export type MessageLocationWhereSchema = typeof MessageLocationWhereSchema;

export namespace MessageLocationWhereSchema {
	export type Type = z.infer<MessageLocationWhereSchema>;
}
