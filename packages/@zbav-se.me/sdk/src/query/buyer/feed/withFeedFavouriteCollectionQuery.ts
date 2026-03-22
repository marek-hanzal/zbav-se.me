import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiFeedFavouriteCollection } from "../../../api/buyer/sdk.gen";
import type { tApiFeedFavouriteCollectionResponse, tFeedQuery } from "../../../api/buyer/types.gen";

export const withFeedFavouriteCollectionQuery = withQuery<
	tFeedQuery,
	tApiFeedFavouriteCollectionResponse[200]
>({
	keys(data) {
		return [
			"feed-favourite",
			"collection",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiFeedFavouriteCollection({
					body,
					headers,
				}),
			);
		},
	}),
});
