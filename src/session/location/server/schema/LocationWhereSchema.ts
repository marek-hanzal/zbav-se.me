import { z } from "zod";
import { LocationFilterSchema } from "~/session/location/server/schema/LocationFilterSchema";

export const LocationWhereSchema = z
	.looseObject({
		...LocationFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "LocationWhere",
		description: "App-based filters",
	});

export type LocationWhereSchema = typeof LocationWhereSchema;

export namespace LocationWhereSchema {
	export type Type = z.infer<LocationWhereSchema>;
}
