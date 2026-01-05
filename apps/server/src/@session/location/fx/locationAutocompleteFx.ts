import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { TextTooShortError } from "~/@session/location/error/TextTooShortError";
import type { LocationDbSchema } from "~/app/location/schema/LocationDbSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { withLocationListFx } from "./withLocationListFx";
import { withLocationRequestFx } from "./withLocationRequestFx";

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
	if (text.length < 3) {
		return yield* new TextTooShortError({
			message: "Text too short",
		});
	}

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const trx = yield* DatabaseContextFx;

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

export type locationAutocompleteFx = ReturnType<typeof locationAutocompleteFx>;
