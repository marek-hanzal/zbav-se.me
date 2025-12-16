import { withQuery } from "@use-pico/client/query";
import { apiFeedFavouriteCollection } from "../../../api/user/sdk.gen";
import type { tApiFeedFavouriteCollectionResponse, tFeedQuery } from "../../../api/user/types.gen";

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
	async queryFn(body) {
		return apiFeedFavouriteCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
