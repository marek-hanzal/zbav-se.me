import { z } from "zod";

export const LocationAutocompleteSchema = z
	.looseObject({
		text: z.string().meta({
			description: "The search text for location autocomplete",
		}),
		lang: z.string().min(2).max(8).meta({
			description: "The language code for the location search",
		}),
	})
	.strip()
	.meta({
		id: "LocationAutocomplete",
		description: "Data for location autocomplete",
	});

export type LocationAutocompleteSchema = typeof LocationAutocompleteSchema;

export namespace LocationAutocompleteSchema {
	export type Type = z.infer<LocationAutocompleteSchema>;
}
