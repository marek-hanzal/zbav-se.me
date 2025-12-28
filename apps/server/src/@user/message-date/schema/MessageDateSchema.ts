import { z } from "@hono/zod-openapi";
import { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageDateDbSchema } from "~/app/message-date/schema/MessageDateDbSchema";

export const MessageDateSchema = z
	.looseObject({
		...MessageDateDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "date" => t === "date", {
			message: `Expected "date"`,
		}),
		direction: MessageDirectionEnumSchema,
	})
	.omit({
		userId: true,
		messageThreadId: true,
	})
	.strip()
	.openapi("MessageDate", {
		description: "Message date entry",
	});

export type MessageDateSchema = typeof MessageDateSchema;

export namespace MessageDateSchema {
	export type Type = z.infer<MessageDateSchema>;
}
