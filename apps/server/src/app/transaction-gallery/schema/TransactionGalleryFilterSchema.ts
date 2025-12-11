import { z } from "@hono/zod-openapi";
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
		side: z
			.enum([
				"buyer",
				"seller",
			])
			.optional()
			.openapi({
				description: "This filter matches the exact side",
			}),
	})
	.openapi("TransactionGalleryFilter", {
		description: "Filter object for transaction gallery",
	});

export type TransactionGalleryFilterSchema = typeof TransactionGalleryFilterSchema;

export namespace TransactionGalleryFilterSchema {
	export type Type = z.infer<TransactionGalleryFilterSchema>;
}
