import { z } from "@hono/zod-openapi";
import { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { MessageGalleryDbSchema } from "~/app/message-gallery/schema/MessageGalleryDbSchema";

export const MessageGallerySchema = z
	.object({
		...MessageGalleryDbSchema.shape,
		type: MessageTypeEnumSchema.refine((t): t is "gallery" => t === "gallery", {
			message: `Expected "text"`,
		}),
		direction: MessageDirectionEnumSchema,
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
