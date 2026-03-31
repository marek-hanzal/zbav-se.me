import { z } from "zod";

export const LatLonSchema = z
	.looseObject({
		lat: z.number().min(-90).max(90).meta({
			description: "Latitude coordinate",
		}),
		lon: z.number().min(-180).max(180).meta({
			description: "Longitude coordinate",
		}),
	})
	.strip()
	.meta({
		id: "LatLon",
		description: "Latitude and longitude coordinates",
	});

export type LatLonSchema = typeof LatLonSchema;

export namespace LatLonSchema {
	export type Type = z.infer<LatLonSchema>;
}
