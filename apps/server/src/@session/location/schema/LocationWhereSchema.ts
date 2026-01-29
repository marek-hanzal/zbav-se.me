import { z } from "@hono/zod-openapi";
import { LocationFilterSchema } from "~/@session/location/schema/LocationFilterSchema";

export const LocationWhereSchema = z
	.object({
		...LocationFilterSchema.shape,
	})
	.openapi("LocationWhere", {
		description: "App-based filters",
	});

export type LocationWhereSchema = typeof LocationWhereSchema;

export namespace LocationWhereSchema {
	export type Type = z.infer<LocationWhereSchema>;
}
