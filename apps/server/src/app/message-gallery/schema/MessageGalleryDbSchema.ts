import { z } from "@hono/zod-openapi";

export const MessageGalleryDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message gallery entry",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread",
	}),
	userId: z.string().openapi({
		description: "ID of the user",
	}),
	galleryId: z.string().openapi({
		description: "ID of the gallery",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessageGalleryDbSchema = typeof MessageGalleryDbSchema;

export namespace MessageGalleryDbSchema {
	export type Type = z.infer<MessageGalleryDbSchema>;
}
