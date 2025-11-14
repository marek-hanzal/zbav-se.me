import { withQuery } from "@use-pico/client/query";
import { apiListingCartCount } from "../../api/session/sdk.gen";
import type { tApiListingCartCountResponse, tListingCartCountQuery } from "../../api/session/types.gen";

export const withListingCartCountQuery = withQuery<tListingCartCountQuery, tApiListingCartCountResponse[200]>({
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
