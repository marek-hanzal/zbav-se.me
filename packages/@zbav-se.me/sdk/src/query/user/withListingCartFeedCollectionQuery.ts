import { withQuery } from "@use-pico/client/query";
import { apiListingCartFeedCollection } from "../../api/user/sdk.gen";
import type { tApiListingCartFeedCollectionResponse, tFeedQuery } from "../../api/user/types.gen";

export const withListingCartFeedCollectionQuery = withQuery<
	tFeedQuery,
	tApiListingCartFeedCollectionResponse[200]
>({
	keys(data) {
		return [
			"listing-cart-feed",
			"collection",
			data,
		];
	},
	async queryFn(body) {
		return apiListingCartFeedCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
