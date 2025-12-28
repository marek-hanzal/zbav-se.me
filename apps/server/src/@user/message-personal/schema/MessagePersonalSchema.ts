import { z } from "@hono/zod-openapi";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessagePersonalDbSchema } from "~/app/message-personal/schema/MessagePersonalDbSchema";

export const MessagePersonalSchema = z
	.looseObject({
		...MessagePersonalDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "personal" => t === "personal", {
			message: `Expected "personal"`,
		}),
		direction: MessageDirectionEnumSchema,
		location: LocationSchema,
	})
	.omit({
		userId: true,
		messageThreadId: true,
	})
	.strip()
	.openapi("MessagePersonal", {
		description: "Message personal entry",
	});

export type MessagePersonalSchema = typeof MessagePersonalSchema;

export namespace MessagePersonalSchema {
	export type Type = z.infer<MessagePersonalSchema>;
}
