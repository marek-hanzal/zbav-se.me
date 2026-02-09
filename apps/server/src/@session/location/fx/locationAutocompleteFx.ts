import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { TextTooShortErrorFx } from "~/@session/location/error/TextTooShortErrorFx";
import { withLocationListFx } from "~/@session/location/fx/withLocationListFx";
import { withLocationRequestFx } from "~/@session/location/fx/withLocationRequestFx";
import type { LocationTableSchema } from "~/database/@table/LocationTableSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withTraceFx } from "~/effect/withTraceFx";

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
	yield* withTraceFx({
		fx: "locationAutocompleteFx",
		input: {
			text,
			lang,
			limit,
		},
	});

	if (text.length < 3) {
		yield* withTraceFx({
			fx: "locationAutocompleteFx",
			error: {
				message: "Text too short",
			},
		});
		return yield* new TextTooShortErrorFx({
			message: "Text too short",
		});
	}

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

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
				yield* Effect.promise(async () => {
					return kysely
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
