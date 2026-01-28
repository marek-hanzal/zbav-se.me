import { z } from "@hono/zod-openapi";
import { LocationTableSchema } from "~/database/@table/LocationTableSchema";

export const LocationSchema = z
	.looseObject({
		...LocationTableSchema.shape,
	})
	.omit({
		geo: true,
	})
	.strip()
	.openapi("Location", {
		description: "Location data",
	});

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<LocationSchema>;
}
