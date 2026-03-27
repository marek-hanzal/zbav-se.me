import { z } from "@hono/zod-openapi";
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
				galleryId: z.string().openapi({
					description: "Gallery identifier linked to this entry",
				}),
			})
			.strip(),
	})
	.strip();

export type GallerySchema = typeof GallerySchema;

export namespace GallerySchema {
	export type Type = z.infer<GallerySchema>;
}
