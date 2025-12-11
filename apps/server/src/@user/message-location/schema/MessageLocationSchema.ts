import { z } from "@hono/zod-openapi";
import type { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageLocationDbSchema } from "~/app/message-location/schema/MessageLocationDbSchema";

export const MessageLocationSchema = z
	.object({
		...MessageLocationDbSchema.shape,
		type: z.literal("location" satisfies MessageTypeEnumSchema.Type).openapi({
			description: "Message type",
		}),
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
