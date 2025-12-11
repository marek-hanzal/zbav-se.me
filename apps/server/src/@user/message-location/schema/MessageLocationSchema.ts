import { z } from "@hono/zod-openapi";
import { MessageLocationDbSchema } from "~/app/message-location/schema/MessageLocationDbSchema";

export const MessageLocationSchema = z
	.object({
		...MessageLocationDbSchema.shape,
	})
	.omit({
		messageThreadId: true,
		userId: true,
		createdAt: true,
	})
	.openapi("MessageLocation", {
		description: "Message location entry",
	});

export type MessageLocationSchema = typeof MessageLocationSchema;

export namespace MessageLocationSchema {
	export type Type = z.infer<MessageLocationSchema>;
}
