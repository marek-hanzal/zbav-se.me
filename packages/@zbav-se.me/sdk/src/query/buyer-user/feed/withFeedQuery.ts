import { withEntityQuery } from "@use-pico/client/query";
import {
	apiFeedCollection,
	apiFeedFetch,
	type tFeed,
	type tFeedQuery,
} from "../../../api/buyer-user";

export const withFeedQuery = withEntityQuery<tFeed, tFeedQuery, tFeedQuery>({
	keys: () => [
		"feed",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetch(data) {
		return apiFeedFetch({
			body: data,
			throwOnError: true,
		}).then((res) => res.data);
	},
	async collection(data) {
		return apiFeedCollection({
			body: data,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
