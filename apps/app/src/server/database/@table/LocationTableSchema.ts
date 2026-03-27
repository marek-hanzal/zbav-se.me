import { z } from "@hono/zod-openapi";

export const LocationTableSchema = z
	.looseObject({
		id: z.string(),
		query: z.string().openapi({
			description: "The query that was used to get the location",
		}),
		lang: z.string().openapi({
			description: "The language that was used to get the location",
		}),
		country: z.string().openapi({
			description: "The country that the location is in",
		}),
		code: z.string().openapi({
			description: "Country code",
		}),
		county: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "The county that the location is in",
			}),
		municipality: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "The municipality that the location is in",
			}),
		state: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "The state that the location is in",
			}),
		address: z.string().openapi({
			description: "Full address preview of a location",
		}),
		city: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "The city that the location is in",
			}),
		street: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "The street that the location is on",
			}),
		zip: z
			.union([
				z.null(),
				z.string(),
			])
			.openapi({
				description: "The postal/zip code of the location",
			}),
		confidence: z.coerce.number().openapi({
			description: "Confidence score of the location (based on query)",
			type: "number",
		}),
		hash: z.string().openapi({
			description: "Used to uniquely identify this location entry",
		}),
		lat: z.coerce.number().openapi({
			description: "Latitude of the location",
			type: "number",
		}),
		lon: z.coerce.number().openapi({
			description: "Longitude of the location",
			type: "number",
		}),
		geo: z.string().openapi({
			description: "Encoded PostGIS geometry of the location (auto-generated from lat/lon)",
			readOnly: true,
		}),
	})
	.strip();

export type LocationTableSchema = typeof LocationTableSchema;

export namespace LocationTableSchema {
	export type Type = z.infer<LocationTableSchema>;
}
