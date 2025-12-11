import { z } from "@hono/zod-openapi";
import { MessageGalleryQuerySchema } from "~/app/message-gallery/schema/MessageGalleryQuerySchema";

export const MessageGalleryPatchSchema = z
	.object({
		query: MessageGalleryQuerySchema,
	})
	.openapi("MessageGalleryPatch", {
		description: "Data for updating an existing message gallery",
	});

export type MessageGalleryPatchSchema = typeof MessageGalleryPatchSchema;

export namespace MessageGalleryPatchSchema {
	export type Type = z.infer<MessageGalleryPatchSchema>;
}
