import { z } from "@hono/zod-openapi";
import { LocationFilterSchema } from "~/server/@session/location/schema/LocationFilterSchema";

export const LocationWhereSchema = z
	.looseObject({
		...LocationFilterSchema.shape,
	})
	.strip()
	.openapi("LocationWhere", {
		description: "App-based filters",
	});

export type LocationWhereSchema = typeof LocationWhereSchema;

export namespace LocationWhereSchema {
	export type Type = z.infer<LocationWhereSchema>;
}
