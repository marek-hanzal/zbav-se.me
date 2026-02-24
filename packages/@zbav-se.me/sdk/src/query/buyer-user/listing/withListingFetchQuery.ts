import { withQuery } from "@use-pico/client/query";
import { apiListingFetch } from "../../../api/buyer-user/sdk.gen";
import type { tApiListingFetchResponse, tListingQuery } from "../../../api/buyer-user/types.gen";

export const withListingFetchQuery = withQuery<tListingQuery, tApiListingFetchResponse[200]>({
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
