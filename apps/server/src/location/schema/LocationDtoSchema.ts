import { z } from "@hono/zod-openapi";
import { LocationSchema } from "./LocationSchema";

export const LocationDtoSchema = z
	.object({
		...LocationSchema.shape,
	})
	.openapi("LocationDto", {
		description: "Location data transfer object",
	});

export type LocationDtoSchema = typeof LocationDtoSchema;

export namespace LocationDtoSchema {
	export type Type = z.infer<LocationDtoSchema>;
}
