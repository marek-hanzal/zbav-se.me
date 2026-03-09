import { z } from "@hono/zod-openapi";
import { BaseCreateSchema } from "./BaseCreateSchema";

export const GalleryCreateSchema = z
	.looseObject({
		...BaseCreateSchema.shape,
		kind: z.literal("gallery"),
		payload: z.looseObject({
			uploadIds: z.array(z.string()).min(1).openapi({
				description: "Ordered uploads used to build the gallery entry",
			}),
		}),
	})
	.openapi("TransactionEntryGalleryCreate");

export type GalleryCreateSchema = typeof GalleryCreateSchema;

export namespace GalleryCreateSchema {
	export type Type = z.infer<GalleryCreateSchema>;
}
