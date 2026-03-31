import { z } from "zod";
import { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";

export const LocationSchema = z
	.looseObject({
		...LocationTableSchema.shape,
	})
	.omit({
		geo: true,
	})
	.strip()
	.meta({
		id: "Location",
		description: "Location data",
	});

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<LocationSchema>;
}
