import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";
import { CursorSchema } from "../../schema/CursorSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

const FilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		userId: z.string().nullish().openapi({
			description: "Exact user id",
		}),
		userIdIn: z.array(z.string()).nullish().openapi({
			description: "User ids in the provided array",
		}),
		listingId: z.string().nullish().openapi({
			description: "Exact listing id",
		}),
		listingIdIn: z.array(z.string()).nullish().openapi({
			description: "Listing ids in the provided array",
		}),
	})
	.openapi("GalleryFilter", {
		description: "User-land filters for gallery items",
	});

export const GalleryQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FilterSchema.nullish(),
		where: FilterSchema.openapi("GalleryWhere", {
			description: "App-based filters",
		}).nullish(),
		sort: z
			.object({
				value: z.enum([
					"sort",
					"createdAt",
					"updatedAt",
				]),
				sort: OrderSchema,
			})
			.openapi("GallerySort", {
				description: "Sort object for gallery collection",
			})
			.array()
			.nullish(),
	})
	.openapi("GalleryQuery", {
		description: "Query object for gallery collection",
	});

export type GalleryQuerySchema = typeof GalleryQuerySchema;

export namespace GalleryQuerySchema {
	export type Type = z.infer<typeof GalleryQuerySchema>;
}
