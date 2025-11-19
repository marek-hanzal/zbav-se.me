import { linkTo } from "@use-pico/common/link-to";
import { Effect } from "effect";
import { AppEnv } from "../../../AppEnv";

export namespace withLocationRequest {
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

export const withLocationRequest = ({ text, lang, limit = 5 }: withLocationRequest.Props) => {
	return Effect.gen(function* () {
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

		const { features } = yield* Effect.tryPromise(async () => {
			return fetch(link).then((res) => {
				return res.json() as unknown as {
					features: withLocationRequest.Feature[];
				};
			});
		});

		return features;
	});
};

export type withLocationRequest = ReturnType<typeof withLocationRequest>;
