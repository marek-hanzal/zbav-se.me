import { withQuery } from "@use-pico/client/query";
import { apiListingCount } from "../../../api/user/sdk.gen";
import type { tApiListingCountResponse, tListingCountQuery } from "../../../api/user/types.gen";

export const withListingCountQuery = withQuery<tListingCountQuery, tApiListingCountResponse[200]>({
	keys(data) {
		return [
			"listing",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiListingCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
