import { z } from "@hono/zod-openapi";
import { MessageTextDbSchema } from "~/app/message-text/schema/MessageTextDbSchema";
import type { TransactionEventEnumSchema } from "~/app/transaction/schema/ListingTransactionEventEnumSchema";

export const MessageTextSchema = z
	.object({
		id: MessageTextDbSchema.shape.id,
		messageThreadId: MessageTextDbSchema.shape.messageThreadId,
		side: MessageTextDbSchema.shape.side,
		message: z.string().openapi({
			description: "Message content",
		}),
		createdAt: MessageTextDbSchema.shape.createdAt,
		event: z.literal("message" satisfies TransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.openapi("MessageText", {
		description: "Message entry",
	});

export type MessageTextSchema = typeof MessageTextSchema;

export namespace MessageTextSchema {
	export type Type = z.infer<MessageTextSchema>;
}
