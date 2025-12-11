import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const MessageGallerySortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("MessageGallerySortField", {
				description: "Available sort fields for message gallery",
			}),
		direction: OrderEnumSchema,
	})
	.openapi("MessageGallerySort", {
		description: "Sort parameters for message gallery collection",
	});

export type MessageGallerySortSchema = typeof MessageGallerySortSchema;

export namespace MessageGallerySortSchema {
	export type Type = z.infer<MessageGallerySortSchema>;
}
