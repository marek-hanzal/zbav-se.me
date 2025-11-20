import { withQuery } from "@use-pico/client/query";
import { apiFeedFetch } from "~/api/user/sdk.gen";
import type { tApiFeedFetchResponse, tFeedQuery } from "~/api/user/types.gen";

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
