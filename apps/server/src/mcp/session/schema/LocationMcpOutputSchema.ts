import { z } from "@hono/zod-openapi";

const NullableStringSchema = z.string().nullable();

export const LocationMcpOutputSchema = z
	.object({
		id: z.string().describe("Unique location id."),
		query: z
			.string()
			.describe(
				"Original search text or normalized query label used to obtain this location. See zbav://mcp/field/location.query.",
			),
		lang: z
			.string()
			.describe(
				"Language code used when the location was resolved. See zbav://mcp/field/location.lang.",
			),
		country: z
			.string()
			.describe(
				"Resolved country name for the location. See zbav://mcp/field/location.country.",
			),
		code: z
			.string()
			.describe(
				"Resolved country code for the location. See zbav://mcp/field/location.code.",
			),
		county: NullableStringSchema.describe(
			"Resolved county, or null when unavailable in the geocoding result.",
		),
		municipality: NullableStringSchema.describe(
			"Resolved municipality, or null when unavailable in the geocoding result.",
		),
		state: NullableStringSchema.describe(
			"Resolved state or region, or null when unavailable in the geocoding result.",
		),
		address: z
			.string()
			.describe(
				"Best human-readable formatted address preview for this location. See zbav://mcp/field/location.address.",
			),
		city: NullableStringSchema.describe(
			"Resolved city, or null when the result is not city-specific. See zbav://mcp/field/location.city.",
		),
		street: NullableStringSchema.describe(
			"Resolved street, or null when the result does not include a street-level match. See zbav://mcp/field/location.street.",
		),
		zip: NullableStringSchema.describe(
			"Resolved postal code, or null when unavailable. See zbav://mcp/field/location.zip.",
		),
		confidence: z
			.number()
			.describe(
				"Geocoding confidence score where higher means a better match. See zbav://mcp/field/location.confidence.",
			),
		hash: z.string().describe("Stable geocoding hash used to deduplicate the location entry."),
		lat: z.number().describe("Latitude in decimal degrees. See zbav://mcp/field/location.lat."),
		lon: z
			.number()
			.describe("Longitude in decimal degrees. See zbav://mcp/field/location.lon."),
	})
	.describe(
		"One structured location suggestion or normalized address result returned by the session location autocomplete MCP tool.",
	);

export type LocationMcpOutputSchema = typeof LocationMcpOutputSchema;

export namespace LocationMcpOutputSchema {
	export type Type = z.infer<LocationMcpOutputSchema>;
}
