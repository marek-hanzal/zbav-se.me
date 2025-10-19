import { createRoute, z } from "@hono/zod-openapi";
import { genId, linkTo, withFetch, withList } from "@use-pico/common";
import { sql } from "kysely";
import { database } from "../database/kysely";
import { AppEnv } from "../env";
import { withSessionHono } from "../withSessionHono";
import { LocationQuerySchema } from "./schema/LocationQuerySchema";
import { LocationSchema } from "./schema/LocationSchema";
import { withLocationQueryBuilderWithSort } from "./withLocationQueryBuilder";

/**
 * Soft schema from Geoapify (we believe in them - a mistake?)
 */
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
		place_id: string;
		rank: {
			confidence: number;
		};
	};
}

/**
 * Generate a numeric lock ID from query and lang for PostgreSQL advisory locks
 * PostgreSQL advisory locks require a bigint (max 2^63-1)
 */
const getLockId = (text: string, lang: string): number => {
	const str = `${text}:${lang}`;
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
};

export const withLocationApi = withSessionHono();

withLocationApi.openapi(
	createRoute({
		method: "get",
		path: "/location/autocomplete",
		description: "Return a location autocomplete",
		operationId: "apiLocationAutocomplete",
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
		tags: [
			"location",
		],
	}),
	async (c) => {
		const { text, lang } = c.req.valid("query");

		// First check: quick cache lookup without lock (outside transaction)
		const quickCache = await withList({
			select: database.kysely
				.selectFrom("Location")
				.where("query", "=", text)
				.where("lang", "=", lang)
				.selectAll(),
			output: LocationSchema,
		});

		if (quickCache.length > 0) {
			c.header("Cache-Control", "public, max-age=31536000, immutable");
			c.header("X-Location-Cache", "hit");
			return c.json(quickCache);
		}

		// Execute within transaction to ensure advisory lock is held properly
		const results = await database.kysely
			.transaction()
			.execute(async (trx) => {
				// Acquire advisory lock to prevent duplicate API calls
				const lockId = getLockId(text, lang);

				// Acquire lock (blocks until available)
				// Using pg_advisory_xact_lock - automatically released at transaction end
				// This ensures the lock is released even if the server crashes
				await sql`SELECT pg_advisory_xact_lock(${lockId})`.execute(trx);

				// Second check: cache might have been filled while waiting for lock
				const cache = await withList({
					select: trx
						.selectFrom("Location")
						.where("query", "=", text)
						.where("lang", "=", lang)
						.orderBy("confidence", "desc")
						.offset(0)
						.limit(3)
						.selectAll(),
					output: LocationSchema,
				});

				if (cache.length > 0) {
					c.header(
						"Cache-Control",
						"public, max-age=31536000, immutable",
					);
					c.header("X-Location-Cache", "wait");
					return cache;
				}

				// Cache miss - fetch from Geoapify
				const link = linkTo({
					base: "https://api.geoapify.com",
					href: "/v1/geocode/autocomplete",
					query: {
						text,
						apiKey: AppEnv.GEOAPIFY,
						lang,
						limit: 3,
					},
				});

				const { features } = (await (await fetch(link)).json()) as {
					features: Feature[];
				};

				const locations = features.map(({ properties }) => ({
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
					hash: properties.place_id,
					//
					lat: properties.lat,
					lon: properties.lon,
				})) satisfies LocationSchema.Type[];

				locations.length > 0 &&
					(await trx
						.insertInto("Location")
						.values(locations)
						.onConflict((oc) =>
							oc
								.columns([
									"lang",
									"hash",
								])
								.doNothing(),
						)
						.execute());

				/**
				 * No cache headers, so it won't reply all the times with cache-miss
				 */

				c.header("X-Location-Cache", "miss");

				return locations;
			});

		return c.json(results);
	},
);

withLocationApi.openapi(
	createRoute({
		method: "post",
		path: "/location/fetch",
		description: "Return a location based on the provided query",
		operationId: "apiLocationFetch",
		request: {
			body: {
				content: {
					"application/json": {
						schema: LocationQuerySchema,
					},
				},
				description: "Query object for location fetch",
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: LocationSchema,
					},
				},
				description: "Return a location based on the provided query",
			},
		},
		tags: [
			"location",
		],
	}),
	async ({ json, req }) => {
		const { filter, where, sort } = req.valid("json");
		return json(
			await withFetch({
				select: database.kysely.selectFrom("Location").selectAll(),
				output: LocationSchema,
				filter,
				where,
				query({ select, where }) {
					return withLocationQueryBuilderWithSort({
						select,
						where,
						sort,
					});
				},
			}),
		);
	},
);
