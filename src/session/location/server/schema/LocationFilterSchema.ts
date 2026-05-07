import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const LocationFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		query: z.string().optional().meta({
			description:
				"This filter matches locations where id equals the value OR query ilike the value (useful for autocomplete)",
		}),
		lang: z.string().optional().meta({
			description: "This filter matches the exact language that was used to get the location",
		}),
		country: z.string().optional().meta({
			description: "This filter matches the exact country of the location",
		}),
		code: z.string().optional().meta({
			description: "This filter matches the exact country code of the location",
		}),
		confidenceMin: z.number().optional().meta({
			description:
				"This filter matches locations with confidence greater than or equal to the provided value",
		}),
	})
	.strip()
	.meta({
		id: "LocationFilter",
		description: "Data for location filter",
	});

export type LocationFilterSchema = typeof LocationFilterSchema;

export namespace LocationFilterSchema {
	export type Type = z.infer<LocationFilterSchema>;
}
