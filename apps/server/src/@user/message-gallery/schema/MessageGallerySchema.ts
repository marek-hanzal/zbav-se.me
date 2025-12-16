import { z } from "@hono/zod-openapi";
import type { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageGalleryDbSchema } from "~/app/message-gallery/schema/MessageGalleryDbSchema";

export const MessageGallerySchema = z
	.object({
		...MessageGalleryDbSchema.shape,
		type: z.literal("gallery" satisfies MessageTypeEnumSchema.Type).openapi({
			description: "Message type",
		}),
	})
	.omit({
		messageThreadId: true,
		userId: true,
		createdAt: true,
	})
	.openapi("MessageGallery", {
		description: "Message gallery entry",
	});

export type MessageGallerySchema = typeof MessageGallerySchema;

export namespace MessageGallerySchema {
	export type Type = z.infer<MessageGallerySchema>;
}
