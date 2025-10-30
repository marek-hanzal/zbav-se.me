import { withQuery } from "@use-pico/client";
import { apiFeedCount, type tCount, type tFeedQuery } from "@zbav-se.me/sdk";

export const withFeedCountQuery = withQuery<tFeedQuery, tCount>({
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
