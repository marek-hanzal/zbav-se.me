import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";

export const MessageDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread referenced by the message",
	}),
	side: TransactionSideEnumSchema,
	message: z.string().openapi({
		description: "Message content",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessageDbSchema = typeof MessageDbSchema;

export namespace MessageDbSchema {
	export type Type = z.infer<MessageDbSchema>;
}
