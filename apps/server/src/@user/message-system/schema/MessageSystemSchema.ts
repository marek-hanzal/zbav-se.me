import { z } from "@hono/zod-openapi";
import { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/@user/message/schema/MessageTypeEnumSchema";
import { MessageSystemTableSchema } from "~/database/@table/MessageSystemTableSchema";

export const MessageSystemSchema = z
	.looseObject({
		...MessageSystemTableSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "system" => t === "system", {
			message: `Expected "system"`,
		}),
		direction: MessageDirectionEnumSchema,
	})
	.omit({
		messageThreadId: true,
	})
	.strip()
	.openapi("MessageSystem", {
		description: "Message system entry",
	});

export type MessageSystemSchema = typeof MessageSystemSchema;

export namespace MessageSystemSchema {
	export type Type = z.infer<MessageSystemSchema>;
}
