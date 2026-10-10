import { z } from "zod";
import { EntrySchema } from "~/database/schema/TransactionEntryTableEntrySchema";
import { TransactionEntryKindEnumSchema } from "~/transaction-contract/schema/TransactionEntryKindEnumSchema";

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
