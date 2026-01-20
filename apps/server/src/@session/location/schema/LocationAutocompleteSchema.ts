import { z } from "@hono/zod-openapi";

export const LocationAutocompleteSchema = z
	.looseObject({
		text: z.string().openapi({
			description: "The search text for location autocomplete",
		}),
		lang: z.string().min(2).max(8).openapi({
			description: "The language code for the location search",
		}),
	})
	.strip()
	.openapi("LocationAutocomplete", {
		description: "Data for location autocomplete",
	});

export type LocationAutocompleteSchema = typeof LocationAutocompleteSchema;

export namespace LocationAutocompleteSchema {
	export type Type = z.infer<LocationAutocompleteSchema>;
}
