import { z } from "@hono/zod-openapi";
import { MessageQuerySchema } from "~/@user/message/schema/MessageQuerySchema";

export const MessageCountQuerySchema = z
	.looseObject({
		...MessageQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.openapi("MessageCountQuery", {
		description: "Query object for message count",
	});

export type MessageCountQuerySchema = typeof MessageCountQuerySchema;

export namespace MessageCountQuerySchema {
	export type Type = z.infer<MessageCountQuerySchema>;
}
