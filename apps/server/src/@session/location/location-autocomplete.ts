import { createRoute, z } from "@hono/zod-openapi";
import { genId } from "@use-pico/common/gen-id";
import { linkTo } from "@use-pico/common/link-to";
import { withList } from "@use-pico/common/list";
import { sql } from "kysely";
import { AppEnv } from "../../AppEnv";
import { database } from "../../database/kysely";
import type { Routes } from "../../hono/Routes";
import { withLocationSelect } from "./db/withLocationSelect";
import { LocationAutocompleteSchema } from "./schema/LocationAutocompleteSchema";
import type { LocationDbSchema } from "./schema/LocationDbSchema";
import { LocationSchema } from "./schema/LocationSchema";

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
		postcode: string;
		state: string;
		street: string;
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

export const withLocationAutocompleteApi: Routes.Fn = ({ sessionHono }) => {
	sessionHono.openapi(
		createRoute({
			method: "post",
			path: "/location/autocomplete",
			description: "Return a location autocomplete",
			operationId: "apiLocationAutocomplete",
			request: {
				body: {
					content: {
						"application/json": {
							schema: LocationAutocompleteSchema,
						},
					},
					description: "Request body for location autocomplete",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.array(LocationSchema),
						},
					},
					description: "Location(s) found (cache hit)",
				},
				201: {
					content: {
						"application/json": {
							schema: z.array(LocationSchema),
						},
					},
					description: "Location(s) created (cache miss)",
				},
			},
			tags: [
				"location",
				"session",
			],
		}),
		async (c) => {
			const { text, lang } = c.req.valid("json");
			const limit = 5;

			// First check: quick cache lookup without lock (outside transaction)
			const quickCache = await withList({
				select: withLocationSelect({
					sort: [],
					source: database.kysely,
				})
					.where((qb) => {
						return qb.or([
							qb("id", "=", text),
							qb("query", "ilike", text),
						]);
					})
					.where("lang", "=", lang)
					.orderBy("confidence", "desc")
					.offset(0)
					.limit(limit),
				output: LocationSchema,
			});

			if (quickCache.length > 0) {
				c.header("X-Location-Cache", "hit");
				return c.json(quickCache, 200);
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
					await sql`SELECT pg_advisory_xact_lock(${lockId})`.execute(
						trx,
					);

					// Second check: cache might have been filled while waiting for lock
					const cache = await withList({
						select: withLocationSelect({
							sort: [],
							source: trx,
						})
							.where("query", "ilike", text)
							.where("lang", "=", lang)
							.orderBy("confidence", "desc")
							.offset(0)
							.limit(limit),
						output: LocationSchema,
					});

					if (cache.length > 0) {
						c.header("X-Location-Cache", "wait");
						return cache;
					}

					// Cache miss - fetch from Geoapify
					const link = linkTo({
						base: "https://api.geoapify.com",
						href: "/v1/geocode/autocomplete",
						query: {
							text,
							apiKey: AppEnv.SERVER_GEOAPIFY_TOKEN,
							lang,
							limit,
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
						city: properties.city,
						street: properties.street,
						zip: properties.postcode,
						//
						confidence: properties.rank.confidence,
						//
						hash: properties.place_id,
						//
						lat: properties.lat,
						lon: properties.lon,
					})) satisfies Omit<
						LocationDbSchema.Type,
						"geo"
					>[] as LocationDbSchema.Type[];

					locations.length > 0 &&
						(await trx
							.insertInto("location")
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

					return withList({
						select: withLocationSelect({
							sort: [],
							source: trx,
						})
							.where("query", "ilike", text)
							.where("lang", "=", lang)
							.orderBy("confidence", "desc")
							.offset(0)
							.limit(limit),
						output: LocationSchema,
					});
				});

			return c.json(results, 201);
		},
	);
};
