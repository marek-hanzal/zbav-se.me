import { z } from "@hono/zod-openapi";
import { CategorySchema } from "~/server/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/server/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";

export const DraftSchema = z
	.looseObject({
		...DraftTableSchema.shape,
		location: z
			.union([
				z.null(),
				LocationSchema,
			])
			.openapi({
				description: "Location data",
			}),
		category: z
			.union([
				z.null(),
				CategorySchema,
			])
			.openapi({
				description: "Category data",
			}),
		gallery: GallerySchema.openapi({
			description: "Draft gallery images",
		}),
	})
	.omit({
		userId: true,
	})
	.strip()
	.openapi("Draft", {
		description: "Draft data",
	});

export type DraftSchema = typeof DraftSchema;

export namespace DraftSchema {
	export type Type = z.infer<DraftSchema>;
}
