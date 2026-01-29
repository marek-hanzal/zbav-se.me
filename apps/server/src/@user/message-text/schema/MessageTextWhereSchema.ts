import { z } from "@hono/zod-openapi";
import { MessageTextFilterSchema } from "~/@user/message-text/schema/MessageTextFilterSchema";

export const MessageTextWhereSchema = z
	.object({
		...MessageTextFilterSchema.shape,
	})
	.openapi("MessageTextWhere", {
		description: "App-based filters",
	});

export type MessageTextWhereSchema = typeof MessageTextWhereSchema;

export namespace MessageTextWhereSchema {
	export type Type = z.infer<MessageTextWhereSchema>;
}
