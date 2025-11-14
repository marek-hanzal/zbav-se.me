import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "../../../schema/DefaultFilterSchema";

export const LocationFilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
		query: z.string().optional().openapi({
			description: "This filter matches the exact query that was used to get the location",
		}),
		lang: z.string().optional().openapi({
			description: "This filter matches the exact language that was used to get the location",
		}),
		country: z.string().optional().openapi({
			description: "This filter matches the exact country of the location",
		}),
		code: z.string().optional().openapi({
			description: "This filter matches the exact country code of the location",
		}),
		confidenceMin: z.number().optional().openapi({
			description: "This filter matches locations with confidence greater than or equal to the provided value",
		}),
	})
	.openapi("LocationFilter", {
		description: "Data for location filter",
	});

export type LocationFilterSchema = typeof LocationFilterSchema;

export namespace LocationFilterSchema {
	export type Type = z.infer<LocationFilterSchema>;
}
