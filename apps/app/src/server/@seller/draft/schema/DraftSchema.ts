import { z } from "zod";
import { CategorySchema } from "~/server/@session/category/schema/CategorySchema";
import { LocationSchema } from "~/server/@session/location/schema/LocationSchema";
import { GallerySchema } from "~/server/@user/gallery/schema/GallerySchema";
import { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";

export const DraftSchema = z
	.looseObject({
		...DraftTableSchema.shape,
		location: LocationSchema.nullable().meta({
			description: "Location data",
		}),
		category: CategorySchema.nullable().meta({
			description: "Category data",
		}),
		gallery: GallerySchema.meta({
			description: "Draft gallery images",
		}),
	})
	.omit({
		userId: true,
	})
	.strip()
	.meta({
		id: "Draft",
		description: "Draft data",
	});

export type DraftSchema = typeof DraftSchema;

export namespace DraftSchema {
	export type Type = z.infer<DraftSchema>;
}
