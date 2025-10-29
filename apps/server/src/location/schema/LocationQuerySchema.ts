import { z } from "@hono/zod-openapi";
import { CursorSchema } from "../../schema/CursorSchema";
import { LocationFilterSchema } from "./LocationFilterSchema";
import { LocationSortSchema } from "./LocationSortSchema";

export const LocationQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: LocationFilterSchema.optional(),
		where: LocationFilterSchema.openapi("LocationWhere", {
			description: "App-based filters",
		}).optional(),
		sort: LocationSortSchema.array().optional(),
	})
	.openapi("LocationQuery", {
		description: "Query object for location collection",
	});

export type LocationQuerySchema = typeof LocationQuerySchema;

export namespace LocationQuerySchema {
	export type Type = z.infer<LocationQuerySchema>;
}
