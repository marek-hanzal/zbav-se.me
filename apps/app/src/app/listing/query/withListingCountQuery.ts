import { withQuery } from "@use-pico/client";
import {
	apiListingCount,
	type tCount,
	type tListingCountQuery,
} from "@zbav-se.me/sdk";

export const withListingCountQuery = withQuery<tListingCountQuery, tCount>({
	keys(data) {
		return [
			"listing",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiListingCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
