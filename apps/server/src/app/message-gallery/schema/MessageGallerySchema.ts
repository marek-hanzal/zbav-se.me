import { z } from "@hono/zod-openapi";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageGalleryDbSchema } from "~/app/message-gallery/schema/MessageGalleryDbSchema";

export const MessageGallerySchema = z
	.looseObject({
		...MessageGalleryDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "gallery" => t === "gallery", {
			message: `Expected "text"`,
		}),
		direction: MessageDirectionEnumSchema,
		gallery: GallerySchema,
	})
	.omit({
		messageThreadId: true,
		userId: true,
	})
	.strip()
	.openapi("MessageGallery", {
		description: "Message gallery entry",
	});

export type MessageGallerySchema = typeof MessageGallerySchema;

export namespace MessageGallerySchema {
	export type Type = z.infer<MessageGallerySchema>;
}
