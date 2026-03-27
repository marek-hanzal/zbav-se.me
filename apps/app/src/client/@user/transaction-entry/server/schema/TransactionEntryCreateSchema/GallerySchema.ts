import { z } from "zod";
import { EntrySchema } from "./EntrySchema";

export const GallerySchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("gallery"),
		payload: z
			.looseObject({
				uploadIds: z.array(z.string()).min(1).meta({
					description: "Ordered uploads used to build the gallery entry",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryGalleryCreate",
	});

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}
