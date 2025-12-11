import { z } from "@hono/zod-openapi";
import { MessageDbSchema } from "~/app/message/schema/MessageDbSchema";
import type { TransactionEventEnumSchema } from "~/app/transaction/schema/TransactionEventEnumSchema";

export const MessageSchema = z
	.object({
		id: MessageDbSchema.shape.id,
		messageThreadId: MessageDbSchema.shape.messageThreadId,
		side: MessageDbSchema.shape.side,
		message: z.string().openapi({
			description: "Message content",
		}),
		createdAt: MessageDbSchema.shape.createdAt,
		event: z.literal("message" satisfies TransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.openapi("Message", {
		description: "Message entry",
	});

export type MessageSchema = typeof MessageSchema;

export namespace MessageSchema {
	export type Type = z.infer<MessageSchema>;
}
