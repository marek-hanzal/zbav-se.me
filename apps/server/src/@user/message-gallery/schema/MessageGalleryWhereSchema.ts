import { z } from "@hono/zod-openapi";
import { MessageGalleryFilterSchema } from "~/@user/message-gallery/schema/MessageGalleryFilterSchema";

export const MessageGalleryWhereSchema = z
	.object({
		...MessageGalleryFilterSchema.shape,
	})
	.openapi("MessageGalleryWhere", {
		description: "App-based filters",
	});

export type MessageGalleryWhereSchema = typeof MessageGalleryWhereSchema;

export namespace MessageGalleryWhereSchema {
	export type Type = z.infer<MessageGalleryWhereSchema>;
}
