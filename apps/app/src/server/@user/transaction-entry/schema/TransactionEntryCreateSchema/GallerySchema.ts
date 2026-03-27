import { z } from "@hono/zod-openapi";
import { EntrySchema } from "./EntrySchema";

export const GallerySchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("gallery"),
		payload: z
			.looseObject({
				uploadIds: z.array(z.string()).min(1).openapi({
					description: "Ordered uploads used to build the gallery entry",
				}),
			})
			.strip(),
	})
	.strip()
	.openapi("TransactionEntryGalleryCreate");

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}
