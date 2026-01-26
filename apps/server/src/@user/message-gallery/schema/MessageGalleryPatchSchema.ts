import { z } from "@hono/zod-openapi";
import { MessageGalleryTableSchema } from "~/database/@table/MessageGalleryTableSchema";
import { MessageGalleryQuerySchema } from "./MessageGalleryQuerySchema";

export const MessageGalleryPatchSchema = z
	.looseObject({
		patch: z
			.looseObject({
				...MessageGalleryTableSchema.shape,
			})
			.omit({
				id: true,
				messageThreadId: true,
				userId: true,
				createdAt: true,
			})
			.strip()
			.partial()
			.openapi({
				description: "Fields to update (all optional)",
			}),
		query: MessageGalleryQuerySchema,
	})
	.strip()
	.openapi("MessageGalleryPatch", {
		description: "Data for updating an existing message gallery",
	});

export type MessageGalleryPatchSchema = typeof MessageGalleryPatchSchema;

export namespace MessageGalleryPatchSchema {
	export type Type = z.infer<MessageGalleryPatchSchema>;
}
