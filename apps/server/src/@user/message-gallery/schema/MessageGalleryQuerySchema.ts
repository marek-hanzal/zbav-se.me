import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { MessageGalleryFilterSchema } from "~/@user/message-gallery/schema/MessageGalleryFilterSchema";
import { MessageGallerySortSchema } from "~/@user/message-gallery/schema/MessageGallerySortSchema";

export const MessageGalleryQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: MessageGalleryFilterSchema.optional(),
		where: MessageGalleryFilterSchema.openapi("MessageGalleryWhere", {
			description: "App-based filters",
		}).optional(),
		sort: MessageGallerySortSchema.array().optional(),
	})
	.openapi("MessageGalleryQuery", {
		description: "Query object for message gallery",
	});

export type MessageGalleryQuerySchema = typeof MessageGalleryQuerySchema;

export namespace MessageGalleryQuerySchema {
	export type Type = z.infer<MessageGalleryQuerySchema>;
}
