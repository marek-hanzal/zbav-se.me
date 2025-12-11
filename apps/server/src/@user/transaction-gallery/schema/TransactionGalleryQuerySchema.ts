import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { TransactionGalleryFilterSchema } from "./TransactionGalleryFilterSchema";
import { TransactionGallerySortSchema } from "./TransactionGallerySortSchema";

export const TransactionGalleryQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: TransactionGalleryFilterSchema.optional(),
		where: TransactionGalleryFilterSchema.openapi("TransactionGalleryWhere", {
			description: "App-based filters",
		}).optional(),
		sort: TransactionGallerySortSchema.array().optional(),
	})
	.openapi("TransactionGalleryQuery", {
		description: "Query object for listing transaction gallery",
	});

export type TransactionGalleryQuerySchema = typeof TransactionGalleryQuerySchema;

export namespace TransactionGalleryQuerySchema {
	export type Type = z.infer<TransactionGalleryQuerySchema>;
}
