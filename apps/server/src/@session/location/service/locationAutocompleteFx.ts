import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { sql } from "kysely";
import type { LocationDbSchema } from "../../../app/location/schema/LocationDbSchema";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { TextTooShortError } from "../error/TextTooShortError";
import { withLocationListFx } from "./withLocationListFx";
import { withLocationRequest } from "./withLocationRequest";

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
		text: string;
		lang: string;
		limit?: number;
	}
}

export const locationAutocompleteFx = ({ text, lang, limit = 5 }: locationAutocompleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		if (text.length < 3) {
			return yield* new TextTooShortError({
				message: "Text too short",
			});
		}

		const results = yield* withLocationListFx({
			database,
			query: {
				where: {
					query: text,
					lang,
				},
				sort: [
					{
						field: "confidence",
						direction: "desc",
					},
				],
				cursor: {
					page: 0,
					size: limit,
				},
			},
		});

		if (results.length > 0) {
			return results;
		}

		// TODO We've to cancel transaction as Effect does not throw

		return yield* Effect.promise(() =>
			database.transaction().execute((trx) =>
				Effect.runPromise(
					Effect.gen(function* () {
						const lockId = getLockId(text, lang);

						yield* Effect.promise(() =>
							sql`SELECT pg_advisory_xact_lock(${lockId})`.execute(trx),
						);

						const cache = yield* withLocationListFx({
							database: trx,
							query: {
								where: {
									query: text,
									lang,
								},
								sort: [
									{
										field: "confidence",
										direction: "desc",
									},
								],
								cursor: {
									page: 0,
									size: limit,
								},
							},
						});

						if (cache.length > 0) {
							return cache;
						}

						const features = yield* withLocationRequest({
							text,
							lang,
							limit,
						});

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

						if (locations.length > 0) {
							yield* Effect.promise(() =>
								trx
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
									.execute(),
							);
						}

						/**
						 * No cache headers, so it won't reply all the times with cache-miss
						 */

						return yield* withLocationListFx({
							database: trx,
							query: {
								where: {
									query: text,
									lang,
								},
								sort: [
									{
										field: "confidence",
										direction: "desc",
									},
								],
								cursor: {
									page: 0,
									size: limit,
								},
							},
						});
					}),
				),
			),
		);
	});
};

export type locationAutocompleteFx = ReturnType<typeof locationAutocompleteFx>;
