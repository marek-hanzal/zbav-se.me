import { z } from "@hono/zod-openapi";
import { BaseEntrySchema } from "./BaseEntrySchema";

export const TransactionEntryGallerySchema = z
	.looseObject({
		...BaseEntrySchema.shape,
		kind: z.literal("gallery"),
		payload: z.looseObject({
			galleryId: z.string().openapi({
				description: "Gallery identifier linked to this entry",
			}),
		}),
	})
	.openapi("TransactionEntryGallery");
