import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiFeedFavouriteCount } from "../../../api/buyer/sdk.gen";
import type { tApiFeedFavouriteCountResponse, tFeedQuery } from "../../../api/buyer/types.gen";

export const withFeedFavouriteCountQuery = withQuery<
	tFeedQuery,
	tApiFeedFavouriteCountResponse[200]
>({
	keys(data) {
		return [
			"feed-favourite",
			"count",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiFeedFavouriteCount({
					body,
					headers,
				}),
			);
		},
	}),
});
