import { withQuery } from "@use-pico/client/query";
import { apiListingMetricsFetch } from "../../api/session/sdk.gen";
import type { tApiListingMetricsFetchResponse } from "../../api/session/types.gen";

export const withListingMetricsFetchQuery = withQuery<string, tApiListingMetricsFetchResponse[200]>({
	keys(variables) {
		return [
			"listing",
			"score",
			variables,
		];
	},
	async queryFn(variables) {
		return apiListingMetricsFetch({
			path: {
				id: variables,
			},
			throwOnError: true,
		}).then((res) => res.data);
	},
});
