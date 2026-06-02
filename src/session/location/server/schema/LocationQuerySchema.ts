import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { LocationSortSchema } from "~/session/location/server/schema/LocationSortSchema";
import { LocationWhereSchema } from "~/session/location/server/schema/LocationWhereSchema";

export const LocationQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: LocationWhereSchema.optional(),
		sort: LocationSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
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
