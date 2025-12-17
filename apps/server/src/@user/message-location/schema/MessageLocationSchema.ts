import { z } from "@hono/zod-openapi";
import { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageLocationDbSchema } from "~/app/message-location/schema/MessageLocationDbSchema";

export const MessageLocationSchema = z
	.object({
		...MessageLocationDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "location" => t === "location", {
			message: `Expected "text"`,
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
