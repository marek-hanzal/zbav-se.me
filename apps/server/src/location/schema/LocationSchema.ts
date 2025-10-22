import { z } from "@hono/zod-openapi";

export const LocationSchema = z
	.object({
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
		county: z.string().nullish().openapi({
			description: "The county that the location is in",
		}),
		municipality: z.string().nullish().openapi({
			description: "The municipality that the location is in",
		}),
		state: z.string().nullish().openapi({
			description: "The state that the location is in",
		}),
		address: z.string().openapi({
			description: "Full address preview of a location",
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
	})
	.openapi("Location", {
		description: "A location cache table",
	});

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<typeof LocationSchema>;
}
