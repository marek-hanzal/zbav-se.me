import { z } from "@hono/zod-openapi";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/@user/message/schema/MessageTypeEnumSchema";
import { MessagePersonalTableSchema } from "~/database/@table/MessagePersonalTableSchema";

export const MessagePersonalSchema = z
	.looseObject({
		...MessagePersonalTableSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "personal" => t === "personal", {
			message: `Expected "personal"`,
		}),
		direction: MessageDirectionEnumSchema,
		location: LocationSchema,
	})
	.omit({
		messageThreadId: true,
		userId: true,
	})
	.strip()
	.openapi("MessagePersonal", {
		description: "Message personal entry",
	});

export type MessagePersonalSchema = typeof MessagePersonalSchema;

export namespace MessagePersonalSchema {
	export type Type = z.infer<MessagePersonalSchema>;
}
