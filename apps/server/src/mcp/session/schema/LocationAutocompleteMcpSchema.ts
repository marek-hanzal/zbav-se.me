import { z } from "@hono/zod-openapi";

export const LocationAutocompleteMcpSchema = z
	.object({
		text: z
			.string()
			.min(1)
			.describe(
				"Address or place text to autocomplete, normalize, or translate into structured location results. Shorter than 3 characters returns an empty result set. See zbav://mcp/field/locationAutocomplete.text.",
			),
		lang: z
			.string()
			.min(2)
			.max(8)
			.describe(
				"Language code used for geocoding output and address normalization, for example cs or en. See zbav://mcp/field/locationAutocomplete.lang.",
			),
	})
	.describe(
		"Session location autocomplete query for searching, normalizing, or translating address-like text into structured location suggestions.",
	);

export type LocationAutocompleteMcpSchema = typeof LocationAutocompleteMcpSchema;

export namespace LocationAutocompleteMcpSchema {
	export type Type = z.infer<LocationAutocompleteMcpSchema>;
}
