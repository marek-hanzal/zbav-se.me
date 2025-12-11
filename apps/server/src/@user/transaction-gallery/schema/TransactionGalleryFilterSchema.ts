import { z } from "@hono/zod-openapi";
import { TransactionSideEnumSchema } from "~/app/transaction/schema/TransactionSideEnumSchema";
import { DefaultFilterSchema } from "~/schema/DefaultFilterSchema";

export const TransactionGalleryFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		messageThreadId: z.string().optional().openapi({
			description: "This filter matches the exact messageThreadId",
		}),
		galleryId: z.string().optional().openapi({
			description: "This filter matches the exact galleryId",
		}),
		side: TransactionSideEnumSchema.optional(),
	})
	.openapi("TransactionGalleryFilter", {
		description: "Filter object for listing transaction gallery",
	});

export type TransactionGalleryFilterSchema = typeof TransactionGalleryFilterSchema;

export namespace TransactionGalleryFilterSchema {
	export type Type = z.infer<TransactionGalleryFilterSchema>;
}
