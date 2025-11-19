import { Effect } from "effect";
import { sql } from "kysely";
import { genId } from "../../../../../../packages/@use-pico/common/src/gen-id/genId";
import type { LocationDbSchema } from "../../../app/location/schema/LocationDbSchema";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { TextTooShortError } from "../error/TextTooShortError";
import { withLocationListFx } from "./withLocationListFx";
import { withLocationRequestFx } from "./withLocationRequestFx";

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
		if (text.length < 3) {
			return yield* new TextTooShortError({
				message: "Text too short",
			});
		}

		const results = yield* withLocationListFx({
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

		return yield* withTransactionFx(
			Effect.gen(function* () {
				const trx = yield* DatabaseContextFx;

				const lockId = getLockId(text, lang);

				yield* Effect.tryPromise(async () => {
					return sql`SELECT pg_advisory_xact_lock(${lockId})`.execute(trx);
				});

				const cache = yield* withLocationListFx({
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

				const features = yield* withLocationRequestFx({
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
				})) satisfies Omit<LocationDbSchema.Type, "geo">[] as LocationDbSchema.Type[];

				if (locations.length > 0) {
					yield* Effect.tryPromise(async () => {
						return trx
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
					});
				}

				return yield* withLocationListFx({
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
		);
	});
};

export type locationAutocompleteFx = ReturnType<typeof locationAutocompleteFx>;
