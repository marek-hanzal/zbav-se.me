import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageGalleryFilterSchema } from "~/@user/message-gallery/schema/MessageGalleryFilterSchema";
import { MessageGallerySortSchema } from "~/@user/message-gallery/schema/MessageGallerySortSchema";
import { MessageGalleryWhereSchema } from "~/@user/message-gallery/schema/MessageGalleryWhereSchema";

export const MessageGalleryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: MessageGalleryFilterSchema.optional(),
		where: MessageGalleryWhereSchema.optional(),
		sort: MessageGallerySortSchema.array().optional(),
	})
	.strip()
	.openapi("MessageGalleryQuery", {
		description: "Query object for message gallery",
	});

export type MessageGalleryQuerySchema = typeof MessageGalleryQuerySchema;

export namespace MessageGalleryQuerySchema {
	export type Type = z.infer<MessageGalleryQuerySchema>;
}
