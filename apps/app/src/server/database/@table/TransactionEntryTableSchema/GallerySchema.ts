import { z } from "zod";
import { TransactionEntryKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntryKindEnumSchema";
import { EntrySchema } from "./EntrySchema";

export const GallerySchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: TransactionEntryKindEnumSchema.extract([
			"gallery",
		]),
		payload: z
			.looseObject({
				galleryId: z.string().meta({
					description: "Gallery identifier linked to this entry",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryGallery",
		description: "Transaction entry gallery payload",
	});

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}
