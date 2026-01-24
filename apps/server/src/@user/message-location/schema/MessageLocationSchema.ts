import { z } from "@hono/zod-openapi";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/@user/message/schema/MessageTypeEnumSchema";
import { MessageLocationDbSchema } from "./MessageLocationDbSchema";

export const MessageLocationSchema = z
	.looseObject({
		...MessageLocationDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "location" => t === "location", {
			message: `Expected "text"`,
		}),
		direction: MessageDirectionEnumSchema,
		location: LocationSchema,
	})
	.omit({
		messageThreadId: true,
		userId: true,
	})
	.strip()
	.openapi("MessageLocation", {
		description: "Message location entry",
	});

export type MessageLocationSchema = typeof MessageLocationSchema;

export namespace MessageLocationSchema {
	export type Type = z.infer<MessageLocationSchema>;
}
