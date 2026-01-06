import { z } from "@hono/zod-openapi";
import { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";

export const LocationSchema = z
	.looseObject({
		...LocationDbSchema.shape,
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
