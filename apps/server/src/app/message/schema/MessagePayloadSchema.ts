import { z } from "@hono/zod-openapi";
import { MessagePersonalSchema } from "~/@user/message-personal/schema/MessagePersonalSchema";
import { MessageSystemSchema } from "~/@user/message-system/schema/MessageSystemSchema";
import { MessageTextSchema } from "~/@user/message-text/schema/MessageTextSchema";
import { MessageGallerySchema } from "~/app/message-gallery/schema/MessageGallerySchema";
import { MessageLocationSchema } from "~/app/message-location/schema/MessageLocationSchema";
import { MessagePackageSchema } from "~/app/message-package/schema/MessagePackageSchema";

export const MessagePayloadSchema = z
	.xor([
		MessageTextSchema,
		MessageGallerySchema,
		MessageLocationSchema,
		MessagePersonalSchema,
		MessagePackageSchema,
		MessageSystemSchema,
	])
	.openapi("MessagePayload", {
		description: "Message payload (unified view across all message types)",
	});

export type MessagePayloadSchema = typeof MessagePayloadSchema;

export namespace MessagePayloadSchema {
	export type Type = z.infer<MessagePayloadSchema>;
}
