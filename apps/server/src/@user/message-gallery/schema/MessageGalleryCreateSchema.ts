import { z } from "@hono/zod-openapi";

export const MessageGalleryCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a gallery to",
		}),
		galleryId: z.string().openapi({
			description: "The ID of the gallery",
		}),
	})
	.openapi("MessageGalleryCreate", {
		description: "Request to create a message gallery",
	});

export type MessageGalleryCreateSchema = typeof MessageGalleryCreateSchema;

export namespace MessageGalleryCreateSchema {
	export type Type = z.infer<MessageGalleryCreateSchema>;
}
