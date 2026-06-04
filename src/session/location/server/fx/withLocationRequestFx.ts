import { Effect } from "effect";
import { linkTo } from "@/lib/common/link-to";
import { getLoggerFx } from "@/lib/common/log";
import { LocationConfigFx } from "../context/LocationConfigFx";

export namespace withLocationRequestFx {
	/**
	 * Soft schema from Geoapify (we believe in them - a mistake?)
	 */
	export interface Feature {
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

	export interface Props {
		text: string;
		lang: string;
		limit?: number;
	}
}

export const withLocationRequestFx = Effect.fn("withLocationRequestFx")(function* ({
	text,
	lang,
	limit = 5,
}: withLocationRequestFx.Props) {
	const logger = yield* getLoggerFx("withLocationRequestFx");
	logger.trace("withLocationRequestFx", {
		text,
		lang,
		limit,
	});

	const locationConfig = yield* LocationConfigFx;

	const link = linkTo({
		base: locationConfig.api,
		href: locationConfig.autocomplete,
		query: {
			text,
			apiKey: locationConfig.geoapifyToken,
			lang,
			limit,
		},
	});

	const { features } = yield* Effect.promise(async () => {
		return fetch(link).then((res) => {
			return res.json() as unknown as {
				features: withLocationRequestFx.Feature[];
			};
		});
	});

	return features;
});

export type withLocationRequestFx = ReturnType<typeof withLocationRequestFx>;
