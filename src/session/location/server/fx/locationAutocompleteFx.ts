import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { LocationTableSchema } from "~/server/database/@table/LocationTableSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { TextTooShortErrorFx } from "~/session/location/server/error/TextTooShortErrorFx";
import { withLocationListFx } from "~/session/location/server/fx/withLocationListFx";
import { withLocationRequestFx } from "~/session/location/server/fx/withLocationRequestFx";

export namespace locationAutocompleteFx {
	export interface Props {
		text: string;
		lang: string;
		limit?: number;
	}
}

export const locationAutocompleteFx = Effect.fn("locationAutocompleteFx")(function* ({
	text,
	lang,
	limit = 5,
}: locationAutocompleteFx.Props) {
	const logger = yield* getLoggerFx("locationAutocompleteFx");
	logger.trace("locationAutocompleteFx", {
		text,
		lang,
		limit,
	});

	if (text.length < 3) {
		return yield* new TextTooShortErrorFx({
			message: "Text too short",
		});
	}

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const results = yield* withLocationListFx({
				where: {
					query: text,
					lang,
				},
				sort: [
					{
						field: "confidence",
						order: "desc",
					},
				],
				cursor: {
					page: 0,
					size: limit,
				},
				scope: {},
			});

			if (results.length > 0) {
				return results;
			}

			const features = yield* withLocationRequestFx({
				text,
				lang,
				limit,
			}).pipe(Effect.withLogSpan("withLocationRequestFx"));

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
			})) satisfies Omit<LocationTableSchema.Type, "geo">[] as LocationTableSchema.Type[];

			if (locations.length > 0) {
				yield* dbFx(async (kysely) =>
					kysely
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

			return yield* withLocationListFx({
				where: {
					query: text,
					lang,
				},
				sort: [
					{
						field: "confidence",
						order: "desc",
					},
				],
				cursor: {
					page: 0,
					size: limit,
				},
				scope: {},
			});
		}),
	);
});

export type locationAutocompleteFx = ReturnType<typeof locationAutocompleteFx>;
