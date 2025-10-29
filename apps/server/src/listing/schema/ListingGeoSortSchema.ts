import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";

export const ListingGeoSortSchema = z
	.object({
		type: z.literal("geo").openapi({
			description: "Explicit geo sorting",
		}),
		value: z.literal("geo").openapi({
			description:
				"Just keeping the same API with rest of sorting values.",
		}),
		lon: z.number().openapi({
			description: "Longitude of the location",
		}),
		lat: z.number().openapi({
			description: "Latitude of the location",
		}),
		sort: OrderSchema,
	})
	.openapi("ListingGeoSort", {
		description: "Explicit geo sorting",
	});

export type ListingGeoSortSchema = typeof ListingGeoSortSchema;

export namespace ListingGeoSortSchema {
	export type Type = z.infer<ListingGeoSortSchema>;
}
