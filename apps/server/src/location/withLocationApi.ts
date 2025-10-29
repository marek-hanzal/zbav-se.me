import { createRoute, z } from "@hono/zod-openapi";
import { genId, linkTo, withFetch, withList } from "@use-pico/common";
import { sql } from "kysely";
import { AppEnv } from "../AppEnv";
import { database } from "../database/kysely";
import type { Routes } from "../hono/Routes";
import { withSessionHono } from "../hono/withSessionHono";
import { ErrorSchema } from "../schema/ErrorSchema";
import { LocationDtoSchema } from "./schema/LocationDtoSchema";
import { LocationQuerySchema } from "./schema/LocationQuerySchema";
import { withLocationQueryBuilder } from "./withLocationQueryBuilder";
import { withLocationSelect } from "./withLocationSelect";

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

export const withLocationApi: Routes.Fn = ({ session }) => {
	const hono = withSessionHono();

	hono.openapi(
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
							schema: z.array(LocationDtoSchema),
						},
					},
					description: "Location(s) found (cache hit)",
				},
				201: {
					content: {
						"application/json": {
							schema: z.array(LocationDtoSchema),
						},
					},
					description: "Location(s) created (cache miss)",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Location not found",
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
					.selectFrom("location")
					.where((qb) => {
						return qb.or([
							qb("id", "=", text),
							qb("query", "=", text),
						]);
					})
					.where("lang", "=", lang)
					.selectAll(),
				output: LocationDtoSchema,
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
					const limit = 2;

					// Acquire lock (blocks until available)
					// Using pg_advisory_xact_lock - automatically released at transaction end
					// This ensures the lock is released even if the server crashes
					await sql`SELECT pg_advisory_xact_lock(${lockId})`.execute(
						trx,
					);

					// Second check: cache might have been filled while waiting for lock
					const cache = await withList({
						select: trx
							.selectFrom("location")
							.where("query", "=", text)
							.where("lang", "=", lang)
							.orderBy("confidence", "desc")
							.offset(0)
							.limit(limit)
							.selectAll(),
						output: LocationDtoSchema,
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
						LocationDtoSchema.Type,
						"geo"
					>[] as LocationDtoSchema.Type[];

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

					return locations;
				});

			if (results.length === 0) {
				return c.json(
					{
						message: "Location not found",
					},
					404,
				);
			}

			return c.json(results, 201);
		},
	);

	hono.openapi(
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
							schema: LocationDtoSchema,
						},
					},
					description:
						"Return a location based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: ErrorSchema,
						},
					},
					description: "Location not found",
				},
			},
			tags: [
				"location",
			],
		}),
		async (c) => {
			const { filter, where, sort } = c.req.valid("json");

			const result = await withFetch({
				select: withLocationSelect({
					sort,
				}),
				output: LocationDtoSchema,
				filter,
				where,
				query: withLocationQueryBuilder,
			});

			if (!result) {
				return c.json(
					{
						message: "Location not found",
					},
					404,
				);
			}

			return c.json(result, 200);
		},
	);

	session.route("/", hono);
};
