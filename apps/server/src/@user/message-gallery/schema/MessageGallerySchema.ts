import { z } from "@hono/zod-openapi";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { MessageDirectionEnumSchema } from "~/@user/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/@user/message/schema/MessageTypeEnumSchema";
import { MessageGalleryTableSchema } from "~/database/@table/MessageGalleryTableSchema";

export const MessageGallerySchema = z
	.looseObject({
		...MessageGalleryTableSchema.shape,
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
