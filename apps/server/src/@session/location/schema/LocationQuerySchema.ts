import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { LocationFilterSchema } from "~/@session/location/schema/LocationFilterSchema";
import { LocationSortSchema } from "~/@session/location/schema/LocationSortSchema";

export const LocationQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: LocationFilterSchema.optional(),
		where: LocationFilterSchema.openapi("LocationWhere", {
			description: "App-based filters",
		}).optional(),
		sort: LocationSortSchema.array().optional(),
	})
	.strip()
	.openapi("LocationQuery", {
		description: "Data for location query",
	});

export type LocationQuerySchema = typeof LocationQuerySchema;

export namespace LocationQuerySchema {
	export type Type = z.infer<LocationQuerySchema>;
}
