import { genId } from "@use-pico/common/gen-id";
import { linkTo } from "@use-pico/common/link-to";
import { withList } from "@use-pico/common/list";
import { Effect } from "effect";
import { sql } from "kysely";
import { AppEnv } from "../../../AppEnv";
import type { LocationDbSchema } from "../../../app/location/schema/LocationDbSchema";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withLocationSelect } from "../db/withLocationSelect";
import { TextTooShortError } from "../error/TextTooShortError";
import { LocationSchema } from "../schema/LocationSchema";

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

export namespace locationAutocompleteFx {
	export interface Props {
		database: WithDatabase;
		text: string;
		lang: string;
		limit?: number;
	}
}

export const locationAutocompleteFx = ({
	database,
	text,
	lang,
	limit = 5,
}: locationAutocompleteFx.Props) => {
	return Effect.gen(function* () {
		if (text.length < 3) {
			return yield* new TextTooShortError({
				message: "Text too short",
			});
		}

		const cache = yield* Effect.promise(async () => {
			return withList({
				select: withLocationSelect({
					sort: [],
					database: database,
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
		});

		if (cache.length > 0) {
			return cache;
		}

		return yield* Effect.promise(async () => {
			return database.transaction().execute(async (trx) => {
				const lockId = getLockId(text, lang);

				await sql`SELECT pg_advisory_xact_lock(${lockId})`.execute(trx);

				const cache = await withList({
					select: withLocationSelect({
						sort: [],
						database: trx,
					})
						.where("query", "ilike", text)
						.where("lang", "=", lang)
						.orderBy("confidence", "desc")
						.offset(0)
						.limit(limit),
					output: LocationSchema,
				});

				if (cache.length > 0) {
					return cache;
				}

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
				})) satisfies Omit<LocationDbSchema.Type, "geo">[] as LocationDbSchema.Type[];

				if (locations.length > 0) {
					await trx
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
						.execute();
				}

				/**
				 * No cache headers, so it won't reply all the times with cache-miss
				 */

				return withList({
					select: withLocationSelect({
						sort: [],
						database: trx,
					})
						.where("query", "ilike", text)
						.where("lang", "=", lang)
						.orderBy("confidence", "desc")
						.offset(0)
						.limit(limit),
					output: LocationSchema,
				});
			});
		});
	});
};

export type locationAutocompleteFx = ReturnType<typeof locationAutocompleteFx>;
