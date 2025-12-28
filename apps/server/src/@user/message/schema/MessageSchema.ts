import { z } from "@hono/zod-openapi";
import { MessageGallerySchema } from "~/@user/message-gallery/schema/MessageGallerySchema";
import { MessageLocationSchema } from "~/@user/message-location/schema/MessageLocationSchema";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { MessageSystemSchema } from "~/@user/message-system/schema/MessageSystemSchema";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";

export const MessageSchema = z
	.xor([
		MessageTextSchema,
		MessageGallerySchema,
		MessageLocationSchema,
		MessagePersonalSchema,
		MessageSystemSchema,
	])
	.openapi("Message", {
		description: "Message entry (unified view across all message types)",
	});

export type MessageSchema = typeof MessageSchema;

export namespace MessageSchema {
	export type Type = z.infer<MessageSchema>;
}
