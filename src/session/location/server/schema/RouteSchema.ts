import { z } from "zod";
import { LatLonSchema } from "@/lib/common/location";
import { RouteModeEnumSchema } from "~/session/location/server/schema/RouteModeEnumSchema";

export const RouteSchema = z
	.looseObject({
		source: LatLonSchema.meta({
			description: "Route source coordinate",
		}),
		target: LatLonSchema.meta({
			description: "Route target coordinate",
		}),
		mode: RouteModeEnumSchema,
	})
	.strip()
	.meta({
		id: "Route",
		description: "Data for route distance calculation",
	});

export type RouteSchema = typeof RouteSchema;

export namespace RouteSchema {
	export type Type = z.infer<RouteSchema>;
}
