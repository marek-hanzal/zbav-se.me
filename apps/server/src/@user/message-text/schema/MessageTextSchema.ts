import { z } from "@hono/zod-openapi";
import { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageTextDbSchema } from "~/app/message-text/schema/MessageTextDbSchema";

export const MessageTextSchema = z
	.object({
		...MessageTextDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "text" => t === "text", {
			message: `Expected "text"`,
		}),
		direction: MessageDirectionEnumSchema,
	})
	.openapi("MessageText", {
		description: "Message entry",
	});

export type MessageTextSchema = typeof MessageTextSchema;

export namespace MessageTextSchema {
	export type Type = z.infer<MessageTextSchema>;
}
