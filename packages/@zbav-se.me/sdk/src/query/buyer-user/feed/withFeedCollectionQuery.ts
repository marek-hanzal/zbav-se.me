import { withQuery } from "@use-pico/client/query";
import { apiFeedCollection } from "../../../api/buyer-user/sdk.gen";
import type { tApiFeedCollectionResponse, tFeedQuery } from "../../../api/buyer-user/types.gen";

export const withFeedCollectionQuery = withQuery<tFeedQuery, tApiFeedCollectionResponse[200]>({
	keys(data) {
		return [
			"feed",
			"collection",
			data,
		];
	},
	async queryFn(body) {
		return apiFeedCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
