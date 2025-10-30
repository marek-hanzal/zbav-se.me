import { withQuery } from "@use-pico/client";
import {
	apiListingFetch,
	type tListingDto,
	type tListingQuery,
} from "@zbav-se.me/sdk";

export const withListingFetchQuery = withQuery<tListingQuery, tListingDto>({
	keys(data) {
		return [
			"listing",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiListingFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
