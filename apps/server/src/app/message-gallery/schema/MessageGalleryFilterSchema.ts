import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const MessageGalleryFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		userId: z.string().optional().openapi({
			description: "This filter matches the exact userId",
		}),
		galleryId: z.string().optional().openapi({
			description: "This filter matches the exact galleryId",
		}),
	})
	.openapi("MessageGalleryFilter", {
		description: "Filter object for message gallery",
	});

export type MessageGalleryFilterSchema = typeof MessageGalleryFilterSchema;

export namespace MessageGalleryFilterSchema {
	export type Type = z.infer<MessageGalleryFilterSchema>;
}
