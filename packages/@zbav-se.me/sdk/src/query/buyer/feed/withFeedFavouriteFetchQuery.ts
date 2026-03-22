import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiFeedFavouriteFetch } from "../../../api/buyer/sdk.gen";
import type { tApiFeedFavouriteFetchResponse, tFeedQuery } from "../../../api/buyer/types.gen";

export const withFeedFavouriteFetchQuery = withQuery<
	tFeedQuery,
	tApiFeedFavouriteFetchResponse[200]
>({
	keys(data) {
		return [
			"feed-favourite",
			"fetch",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiFeedFavouriteFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
