import { z } from "zod";
import { TransactionEntryDirectionEnumSchema } from "~/@user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import { GallerySchema as BaseGallerySchema } from "~/server/database/@table/TransactionEntryTableSchema/GallerySchema";

export const TransactionEntryGallery = z
	.looseObject({
		...BaseGallerySchema.shape,
		direction: TransactionEntryDirectionEnumSchema,
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
