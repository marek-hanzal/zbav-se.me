import { withQuery } from "@use-pico/client/query";
import { apiFeedFetch } from "../../../api/buyer-user/sdk.gen";
import type { tApiFeedFetchResponse, tFeedQuery } from "../../../api/buyer-user/types.gen";

export const withFeedFetchQuery = withQuery<tFeedQuery, tApiFeedFetchResponse[200]>({
	keys(data) {
		return [
			"feed",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiFeedFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
