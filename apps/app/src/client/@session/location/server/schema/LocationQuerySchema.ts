import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { LocationFilterSchema } from "~/client/@session/location/server/schema/LocationFilterSchema";
import { LocationSortSchema } from "~/client/@session/location/server/schema/LocationSortSchema";
import { LocationWhereSchema } from "~/client/@session/location/server/schema/LocationWhereSchema";

export const LocationQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: LocationFilterSchema.optional(),
		where: LocationWhereSchema.optional(),
		sort: LocationSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "LocationQuery",
		description: "Data for location query",
	});

export type LocationQuerySchema = typeof LocationQuerySchema;

export namespace LocationQuerySchema {
	export type Type = z.infer<LocationQuerySchema>;
}
