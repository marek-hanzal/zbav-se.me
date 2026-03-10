import { z } from "@hono/zod-openapi";
import { EntrySchema } from "./EntrySchema";

export const GallerySchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("gallery"),
		payload: z.looseObject({
			galleryId: z.string().openapi({
				description: "Gallery identifier linked to this entry",
			}),
		}),
	})
	.strip()
	.openapi("TransactionEntryGallery");
