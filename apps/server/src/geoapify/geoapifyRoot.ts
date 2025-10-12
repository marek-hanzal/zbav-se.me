import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { genId, linkTo } from "@use-pico/common";
import { database } from "../database/kysely";
import { AppEnv } from "../env";
import { LocationSchema } from "./schema/LocationSchema";

export const geoapifyRoot = new OpenAPIHono();

interface Feature {
	properties: {
		city: string;
		country: string;
		country_code: string;
		county: string;
		formatted: string;
		lat: number;
		lon: number;
		municipality: string;
		state: string;
		rank: {
			confidence: number;
		};
	};
}

geoapifyRoot.openapi(
	createRoute({
		method: "get",
		path: "/location/autocomplete",
		description: "Return a location autocomplete",
		request: {
			query: z.object({
				text: z.string().min(3),
				lang: z.string().min(2).max(8),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(LocationSchema),
					},
				},
				description: "Return a location autocomplete",
			},
		},
	}),
	async ({ json, req }) => {
		const { text, lang } = req.valid("query");

		const link = linkTo({
			base: "https://api.geoapify.com",
			href: "/v1/geocode/autocomplete",
			query: {
				text,
				apiKey: AppEnv.GEOAPIFY,
				lang,
			},
		});

		const { features } = (await (await fetch(link)).json()) as {
			features: Feature[];
		};

		const results = features.map(({ properties }) => ({
			id: genId(),
			//
			query: text,
			lang,
			//
			country: properties.country,
			code: properties.country_code,
			municipality: properties.municipality,
			state: properties.state,
			county: properties.county,
			address: properties.formatted,
			//
			confidence: properties.rank.confidence,
			//
			lat: properties.lat,
			lon: properties.lon,
		}));

		database.kysely.insertInto("Location").values(results).execute();

		return json([]);
	},
);
