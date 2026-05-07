import { z } from "zod";

export const LocationTableSchema = z
	.looseObject({
		id: z.string(),
		query: z.string().meta({
			description: "The query that was used to get the location",
		}),
		lang: z.string().meta({
			description: "The language that was used to get the location",
		}),
		country: z.string().meta({
			description: "The country that the location is in",
		}),
		code: z.string().meta({
			description: "Country code",
		}),
		county: z.string().nullable().meta({
			description: "The county that the location is in",
		}),
		municipality: z.string().nullable().meta({
			description: "The municipality that the location is in",
		}),
		state: z.string().nullable().meta({
			description: "The state that the location is in",
		}),
		address: z.string().meta({
			description: "Full address preview of a location",
		}),
		city: z.string().nullable().meta({
			description: "The city that the location is in",
		}),
		street: z.string().nullable().meta({
			description: "The street that the location is on",
		}),
		zip: z.string().nullable().meta({
			description: "The postal/zip code of the location",
		}),
		confidence: z.coerce.number().meta({
			description: "Confidence score of the location (based on query)",
			type: "number",
		}),
		hash: z.string().meta({
			description: "Used to uniquely identify this location entry",
		}),
		lat: z.coerce.number().meta({
			description: "Latitude of the location",
			type: "number",
		}),
		lon: z.coerce.number().meta({
			description: "Longitude of the location",
			type: "number",
		}),
		geo: z.string().meta({
			description: "Encoded PostGIS geometry of the location (auto-generated from lat/lon)",
			readOnly: true,
		}),
	})
	.meta({
		id: "LocationTable",
		description: "Database row for a location lookup result.",
	})
	.strip();

export type LocationTableSchema = typeof LocationTableSchema;

export namespace LocationTableSchema {
	export type Type = z.infer<LocationTableSchema>;
}
