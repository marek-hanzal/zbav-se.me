import { withQuery } from "@use-pico/client";
import { apiFeedCount, type Count, type FeedQuery } from "@zbav-se.me/sdk";

export const withFeedCountQuery = withQuery<FeedQuery, Count>({
	keys(data) {
		return [
			"feed",
			"count",
			data,
		];
	},
	async queryFn(data) {
		return apiFeedCount(data).then((res) => res.data);
	},
});
