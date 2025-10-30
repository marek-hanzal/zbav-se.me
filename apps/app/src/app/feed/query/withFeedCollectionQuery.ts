import { withQuery } from "@use-pico/client";
import {
	apiFeedCollection,
	type tFeedCollection,
	type tFeedQuery,
} from "@zbav-se.me/sdk";

export const withFeedCollectionQuery = withQuery<tFeedQuery, tFeedCollection>({
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
