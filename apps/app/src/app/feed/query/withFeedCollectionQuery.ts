import { withQuery } from "@use-pico/client/query";
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
	async queryFn(body) {
		return apiFeedCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
