import { z } from "@hono/zod-openapi";
import { CategorySchema } from "~/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/@user/gallery/schema/GallerySchema";
import { DraftDbSchema } from "~/app/draft/schema/DraftDbSchema";

export const DraftSchema = z
	.looseObject({
		...DraftDbSchema.shape,
		location: z.union([
			LocationSchema,
			z.null(),
		]),
		category: z.union([
			CategorySchema,
			z.null(),
		]),
		gallery: z
			.union([
				GallerySchema,
				z.null(),
			])
			.openapi({
				description: "Draft gallery images",
			}),
	})
	.omit({
		userId: true,
		titleVec: true,
	})
	.strip()
	.openapi("Draft", {
		description: "Draft data",
	});

export type DraftSchema = typeof DraftSchema;

export namespace DraftSchema {
	export type Type = z.infer<DraftSchema>;
}
