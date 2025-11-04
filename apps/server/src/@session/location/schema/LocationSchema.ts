import { z } from "@hono/zod-openapi";
import { LocationDbSchema } from "./LocationDbSchema";

export const LocationSchema = z
	.object({
		...LocationDbSchema.shape,
	})
	.omit({
		geo: true,
	})
	.openapi("Location", {
		description: "Location data transfer object",
	});

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<LocationSchema>;
}
