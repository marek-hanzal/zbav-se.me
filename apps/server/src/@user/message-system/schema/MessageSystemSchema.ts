import { z } from "@hono/zod-openapi";
import { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageSystemDbSchema } from "~/app/message-system/schema/MessageSystemDbSchema";

export const MessageSystemSchema = z
	.object({
		...MessageSystemDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "system" => t === "system", {
			message: `Expected "system"`,
		}),
		direction: MessageDirectionEnumSchema,
	})
	.omit({
		messageThreadId: true,
		createdAt: true,
	})
	.openapi("MessageSystem", {
		description: "Message system entry",
	});

export type MessageSystemSchema = typeof MessageSystemSchema;

export namespace MessageSystemSchema {
	export type Type = z.infer<MessageSystemSchema>;
}
