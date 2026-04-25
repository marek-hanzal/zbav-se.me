import { z } from "zod";
import { GallerySchema as BaseGallerySchema } from "~/server/database/@table/TransactionEntryTableSchema/GallerySchema";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";

export const TransactionEntryGallery = z
	.looseObject({
		...BaseGallerySchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
		listingId: z.string().meta({
			description: "Listing this entry belongs to",
		}),
	})
	.strip()
	.meta({
		id: "TransactionEntryGallery",
		description: "Transaction gallery entry with linked gallery payload",
	});

export type TransactionEntryGallery = typeof TransactionEntryGallery;

export namespace TransactionEntryGallery {
	export type Type = z.infer<TransactionEntryGallery>;
}
