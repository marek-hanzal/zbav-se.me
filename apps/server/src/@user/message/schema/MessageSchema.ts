import { z } from "@hono/zod-openapi";
import { MessageGallerySchema } from "~/@user/message-gallery/schema/MessageGallerySchema";
import { MessageLocationSchema } from "~/@user/message-location/schema/MessageLocationSchema";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";

export const MessageSchema = z
	.xor([
		MessageTextSchema,
		MessageGallerySchema,
		MessageLocationSchema,
	])
	.openapi("Message", {
		description: "Message entry (unified view across all message types)",
	});

export type MessageSchema = typeof MessageSchema;

export namespace MessageSchema {
	export type Type = z.infer<MessageSchema>;
}
