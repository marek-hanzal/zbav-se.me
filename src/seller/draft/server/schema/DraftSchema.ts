import { z } from "zod";
import { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { CategorySchema } from "~/user/category/server/schema/CategorySchema";
import { GallerySchema } from "~/user/gallery/server/schema/GallerySchema";

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
