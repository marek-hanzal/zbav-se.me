import { z } from "@hono/zod-openapi";

export const LatLonSchema = z
	.looseObject({
		lat: z.number().min(-90).max(90).openapi({
			description: "Latitude coordinate",
		}),
		lon: z.number().min(-180).max(180).openapi({
			description: "Longitude coordinate",
		}),
	})
	.strip()
	.openapi("LatLon", {
		description: "Latitude and longitude coordinates",
	});

export type LatLonSchema = typeof LatLonSchema;

export namespace LatLonSchema {
	export type Type = z.infer<LatLonSchema>;
}
