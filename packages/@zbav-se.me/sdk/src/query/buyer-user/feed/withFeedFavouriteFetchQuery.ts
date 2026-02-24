import { withQuery } from "@use-pico/client/query";
import { apiFeedFavouriteFetch } from "../../../api/buyer-user/sdk.gen";
import type { tApiFeedFavouriteFetchResponse, tFeedQuery } from "../../../api/buyer-user/types.gen";

export const withFeedFavouriteFetchQuery = withQuery<tFeedQuery, tApiFeedFavouriteFetchResponse[200]>(
	{
		keys(data) {
			return [
				"feed-favourite",
				"fetch",
				data,
			];
		},
		async queryFn(body) {
			return apiFeedFavouriteFetch({
				body,
				throwOnError: true,
			}).then((res) => res.data);
		},
	},
);
