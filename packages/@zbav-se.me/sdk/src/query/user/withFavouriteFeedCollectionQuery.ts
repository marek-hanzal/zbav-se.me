import { withQuery } from "@use-pico/client/query";
import { apiFavouriteFeedCollection } from "../../api/user/sdk.gen";
import type { tApiFavouriteFeedCollectionResponse, tFeedQuery } from "../../api/user/types.gen";

export const withFavouriteFeedCollectionQuery = withQuery<
	tFeedQuery,
	tApiFavouriteFeedCollectionResponse[200]
>({
	keys(data) {
		return [
			"favourite-feed",
			"collection",
			data,
		];
	},
	async queryFn(body) {
		return apiFavouriteFeedCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
