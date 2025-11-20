import { withQuery } from "@use-pico/client/query";
import { apiListingCartCount } from "~/api/user/sdk.gen";
import type { tApiListingCartCountResponse, tListingCartCountQuery } from "~/api/user/types.gen";

export const withListingCartCountQuery = withQuery<
	tListingCartCountQuery,
	tApiListingCartCountResponse[200]
>({
	keys(data) {
		return [
			"listing-cart",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiListingCartCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
