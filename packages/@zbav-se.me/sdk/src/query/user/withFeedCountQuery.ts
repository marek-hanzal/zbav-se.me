import { withQuery } from "@use-pico/client/query";
import { apiFeedCount } from "../../api/user/sdk.gen";
import type { tApiFeedCountResponse, tFeedQuery } from "../../api/user/types.gen";

export const withFeedCountQuery = withQuery<tFeedQuery, tApiFeedCountResponse[200]>({
	keys(data) {
		return [
			"feed",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiFeedCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
