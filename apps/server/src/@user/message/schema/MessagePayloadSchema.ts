import { z } from "@hono/zod-openapi";
import { MessageGallerySchema } from "~/@user/message-gallery/schema/MessageGallerySchema";
import { MessageLocationSchema } from "~/@user/message-location/schema/MessageLocationSchema";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { MessageSystemSchema } from "~/@user/message-system/schema/MessageSystemSchema";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";

export const MessagePayloadSchema = z
	.xor([
		MessageTextSchema,
		MessageGallerySchema,
		MessageLocationSchema,
		MessagePersonalSchema,
		MessageSystemSchema,
	])
	.openapi("MessagePayload", {
		description: "Message payload (unified view across all message types)",
	});

export type MessagePayloadSchema = typeof MessagePayloadSchema;

export namespace MessagePayloadSchema {
	export type Type = z.infer<MessagePayloadSchema>;
}
