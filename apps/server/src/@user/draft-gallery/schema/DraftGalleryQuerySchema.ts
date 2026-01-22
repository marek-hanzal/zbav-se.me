import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { DraftGalleryFilterSchema } from "./DraftGalleryFilterSchema";
import { DraftGallerySortSchema } from "./DraftGallerySortSchema";

export const DraftGalleryQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: DraftGalleryFilterSchema.optional(),
		where: DraftGalleryFilterSchema.openapi("DraftGalleryWhere", {
			description: "App-based filters",
		}).optional(),
		sort: DraftGallerySortSchema.array().optional(),
	})
	.strip()
	.openapi("DraftGalleryQuery", {
		description: "Query object for draft gallery collection",
	});

export type DraftGalleryQuerySchema = typeof DraftGalleryQuerySchema;

export namespace DraftGalleryQuerySchema {
	export type Type = z.infer<DraftGalleryQuerySchema>;
}
