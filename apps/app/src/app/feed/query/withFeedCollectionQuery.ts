import { withQuery } from "@use-pico/client";
import {
	apiFeedCollection,
	type FeedCollection,
	type FeedQuery,
} from "@zbav-se.me/sdk";

export const withFeedCollectionQuery = withQuery<FeedQuery, FeedCollection>({
	keys(data) {
		return [
			"feed",
			"collection",
			data,
		];
	},
	async queryFn(data) {
		return apiFeedCollection(data).then((res) => res.data);
	},
});
