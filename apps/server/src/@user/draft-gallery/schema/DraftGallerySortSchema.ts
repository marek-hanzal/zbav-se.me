import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const DraftGallerySortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("DraftGallerySortField", {
				description: "Field of the draft gallery sort",
			}),
		direction: OrderEnumSchema,
	})
	.strip()
	.openapi("DraftGallerySort", {
		description: "Sort object for draft gallery collection",
	});

export type DraftGallerySortSchema = typeof DraftGallerySortSchema;

export namespace DraftGallerySortSchema {
	export type Type = z.infer<DraftGallerySortSchema>;
}
